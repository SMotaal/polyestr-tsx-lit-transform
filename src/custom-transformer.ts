import {
    ts, Transformer, TransformFlags,
    SyntaxKind,
    SourceFileKind, CallExpressionKind,
} from './typescript-utils';

import { string, object, Trace, trace, measure, Metrics } from './utils';

import Context = CustomTransformer.TransformationContext;

export const bypassFilter: Filter = <T extends Node>(node: T) => false;
export const passthroughFilter: Filter = <T extends Node>(node: T) => node;
const enableOriginalText = true;

export function transform<T extends Node = SourceFile>(
    this: typeof CustomTransformer | void,
    context: Context,
    Transformer: typeof CustomTransformer = this || CustomTransformer, // this && this.prototype instanceof CustomTransformer ? this : CustomTransformer, //  CustomTransformer,
    { filter }: { filter?: Filter } = Transformer
): Transformer<T> {
    filter = typeof filter === 'function' ? filter : passthroughFilter;
    return (root: T & { context: Context }) => {
        if (!root || (filter && !filter(root))) return root;
        CustomTransformer.contextualize(root, context, {
            root, [root.kind === SourceFileKind ? 'sourceFile' : 'root']: root
        }).context;
        const transformer = new Transformer(root.context);
        return ts.visitNode(root, CustomTransformer.visitor(root.context, transformer));
    };
};

export class CustomTransformer {

    static filter: Filter = bypassFilter;

    static transformer:
    (<T extends Node = SourceFile>(context: Context, ...args) => Transformer<T>)
    | (<T extends Node = SourceFile>(context: TransformationContext, Transformer?: typeof CustomTransformer, { filter }?: { filter?: Filter }) => Transformer<T>)
    | (<T extends Node = SourceFile>(context: TransformationContext, filter?: Filter) => Transformer<T>) = transform;

    filter?: Filter;
    printer = ts.createPrinter();

    constructor(public context: Context) {
        this.filter = this.constructor['filter'];
        this.trace = this.trace.bind(this);
        this.visit = this.visit.bind(this);
        this.visitor = this.visitor.bind(this);
        this.transformer = this.transformer.bind(this);
        this.traverse = this.traverse.bind(this);
        this.substitution = this.substitution.bind(this);
        this.print = this.print.bind(this);
    }

    visitor(node, context: Context = this.context): ts.VisitResult<ts.Node> {
        return this.traverse(node, context);
    }

    visit(node, context: Context = this.context): ts.VisitResult<ts.Node> {
        this.contextualize(node, context) && (
            (node.syntaxKind || (node.syntaxKind = SyntaxKind[node.kind])),
            enableOriginalText && (node.originalText || (node.originalText = this.print(node)))
        );
        return this.trace(node, 'Visit');
    }

    transformer(node: Node & { context: Context }, transform = node && this[node.kind]) {
        let context = node && node.context;
        let transformedNode = typeof transform === 'function' &&
            transform.call(this, this.trace(node, 'Transform'));
        if (transformedNode) {
            if (transformedNode !== node)
                this.substitution(node, transformedNode);
            return this.trace(transformedNode, 'Transform');
        } else {
            return this.trace(node, transform ? 'Ignore' : 'Skip');
        }
    }

    contextualize<node extends Node>(node: node & { context: Context }): node | false;
    contextualize<node extends Node>(node: node, context: Context): node | false;
    contextualize(node, context?, sourceFile?) {
        return (
            (node.context && node.context === context
                || (node.context = context = context || node.context)) &&
            (node.sourceFile && node.sourceFile === sourceFile
                || (node.sourceFile = sourceFile = sourceFile || node.sourceFile || context.sourceFile))
        ) && node || false;
    }

    print(node, sourceFile = node.sourceFile, hint = ts.EmitHint.Unspecified) {
        return node && sourceFile ? this.printer.printNode(hint, node, node.sourceFile) : undefined;
    }

    traverse(node, context = this.context) {
        const traceNode = (node, parentTrace = node && node.trace && node.trace.parent || context.trace || trace) => {
            if (node) {
                let { trace: nodeTrace = new Trace() } = node || '';
                nodeTrace('[Node]', node), nodeTrace.parent = parentTrace, node.trace = nodeTrace;
            }
            return node;
        }
        return (this.filter ? this.filter(node) : node) && traceNode(node) && (
            traceNode(node = this.visit(ts.visitEachChild(node, this.visitor, context), context) || node)
            && (context.trace && context.trace(`${'Traverse'}[${SyntaxKind[node.kind]}]`, node.trace.traces)),
            node && traceNode(node = this.transformer(node))
        ) || node;
    }

    substitution(node, substitute, context = this.context) {
        if (substitute.original && substitute.original !== node) {
            const error = Error(`Cannot substitute a node that is already substituted for a different node.`);
            console.warn(error, { node, substitute, context });
            // throw error;
        }
        if (ts['updateNode']) {
            ts['updateNode'](substitute, node);
        } else {
            substitute.original === node || ts.setOriginalNode(substitute, node);
            const { pos, end } = node; ts.setTextRange(substitute, { pos, end });
        }
        if (enableOriginalText) substitute.originalText = node.originalText;
        substitute.transformedText = this.printer.printNode(ts.EmitHint.Unspecified, substitute, context.sourceFile as any);
        return substitute;
    }

    capture(node) { return Object.assign(Object.create(node), node); }

    trace(node: Node, context?: Context | string | object);
    trace(node: Node, context: Context | object, method?: 'Trace' | string);
    trace(node, context?: any, method = string(context)) {
        const trace = console.error.bind(console);
        return (node.trace || context.trace || this.context.trace || trace)(
            `${string(method) || 'Trace'}[${SyntaxKind[node.kind]}]`,
            object(context) ? { transformer: this, node, ...context } : this.capture(node)
        ), node;
    }

    [SourceFileKind](node: SourceFile & Node & { original: SourceFile & Node }, context = this.context) {
        /** @see https://github.com/angular/tsickle/blob/b5834b19ecf8bf31be512eeea9c789b118480fbf/src/transformer_util.ts#L611 */
        // const transformed = node.original && node !== node.original && node.text && node.text === node.original.text && node.originalText && node.originalText !== node.original.originalText;
        return node;
    }

}

export namespace CustomTransformer {

    export const printer = ts.createPrinter();
    export function print(node, sourceFile = node.sourceFile, hint = ts.EmitHint.Unspecified) {
        return node && sourceFile ? this.printer.printNode(hint, node, node.sourceFile) : undefined;
    }

    export const contextualize =
        (node: Node, context: TransformationContext, properties?: object) => {
            if (!node || !context) return node;

            const { trace: trace, traces } = (context = node.context =
                typeof properties === 'object'
                    ? Object.setPrototypeOf(properties, context)
                    : Object.create(context)).trace = new Trace();

            const { fileName, kind, syntaxKind = SyntaxKind[kind] } = ((context.root = node) || '') as any;

            const sourceFile: SourceFile = context.sourceFile =
                node.kind === SourceFileKind ? node : node.getSourceFile() as any;

            Trace.trace(`TransformFile[${fileName || syntaxKind}]`, traces);
            trace('[Context]', context);

            return node;
        };

    export const visitor =
        <T extends Node>(context, transformer: CustomTransformer) =>  //  = new JSXTransformer(context)
            (node, context = transformer.context) =>
                transformer.visitor(node, context);

    // export const transformer =
    //     <T extends Node = SourceFile>(
    //         context: TransformationContext,
    //         Transformer: typeof CustomTransformer = CustomTransformer,
    //         { filter }: { filter?: Filter } = Transformer
    //     ): Transformer<T> => (
    //             filter = typeof filter === 'function' ? filter : passthroughFilter,
    //             ((root: T) =>
    //                 filter(root) ? ts.visitNode(root, CustomTransformer.visitor(
    //                     CustomTransformer.contextualize(root, context, {
    //                         root, [root.kind === SourceFileKind ? 'sourceFile' : 'root']: root
    //                     }),
    //                     new Transformer(context),
    //                 )) : root
    //             )
    //         );

}

export declare namespace CustomTransformer {
    export type SourceFileNode = ts.SourceFile & Node;

    export interface TransformationResult<T extends Node = SourceFile> extends ts.TransformationResult<T>, CustomFields {
        elapsed?: number;
        transformed: T[];
        metrics?: Metrics;
    }

    export interface SourceFile extends SourceFileNode {
        transformationResult?: TransformationResult<any>;
    }

    export interface TransformationContext extends ts.TransformationContext, CustomFields {
        node?: Node;
        [name: string]: any;
        root?: Node;
    }

    export interface Node extends ts.Node, CustomFields {
        originalText?: string;
        text?: string;
        escapedText?: string;
        context?: TransformationContext;
        templateString?: string;
        templateTokens?: any;
    }

    export interface CustomFields {
        sourceFile?: SourceFile;
        context?: TransformationContext;
        parentNode?: Node; parentContext?: TransformationContext;
        trace?: <T>(heading: string, context: T) => T;
        metrics?: Metrics;
    }
    export type Filter<T extends Node = Node> = (node: T) => T | false;
}

export import TransformationContext = CustomTransformer.TransformationContext;
export import TransformationResult = CustomTransformer.TransformationResult;
export import SourceFile = CustomTransformer.SourceFile;
export import Node = CustomTransformer.Node;
export import Filter = CustomTransformer.Filter;
// export import CustomFields = CustomTransformer.CustomFields;
export import print = CustomTransformer.print;
// export import transform = CustomTransformer.transform;
// CustomTransformer.transform = CustomTransformer.transformer;

export default CustomTransformer;
