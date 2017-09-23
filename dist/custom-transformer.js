"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_utils_1 = require("./typescript-utils");
const utils_1 = require("./utils");
exports.bypassFilter = (node) => false;
exports.passthroughFilter = (node) => node;
const enableOriginalText = true;
function transform(context, Transformer = this || CustomTransformer, // this && this.prototype instanceof CustomTransformer ? this : CustomTransformer, //  CustomTransformer,
    { filter } = Transformer) {
    filter = typeof filter === 'function' ? filter : exports.passthroughFilter;
    return (root) => {
        if (!root || (filter && !filter(root)))
            return root;
        CustomTransformer.contextualize(root, context, {
            root, [root.kind === typescript_utils_1.SourceFileKind ? 'sourceFile' : 'root']: root
        }).context;
        const transformer = new Transformer(root.context);
        return typescript_utils_1.ts.visitNode(root, CustomTransformer.visitor(root.context, transformer));
    };
}
exports.transform = transform;
;
class CustomTransformer {
    constructor(context) {
        this.context = context;
        this.printer = typescript_utils_1.ts.createPrinter();
        this.filter = this.constructor['filter'];
        this.trace = this.trace.bind(this);
        this.visit = this.visit.bind(this);
        this.visitor = this.visitor.bind(this);
        this.transformer = this.transformer.bind(this);
        this.traverse = this.traverse.bind(this);
        this.substitution = this.substitution.bind(this);
        this.print = this.print.bind(this);
    }
    visitor(node, context = this.context) {
        return this.traverse(node, context);
    }
    visit(node, context = this.context) {
        this.contextualize(node, context) && ((node.syntaxKind || (node.syntaxKind = typescript_utils_1.SyntaxKind[node.kind])),
            enableOriginalText && (node.originalText || (node.originalText = this.print(node))));
        return this.trace(node, 'Visit');
    }
    transformer(node, transform = node && this[node.kind]) {
        let context = node && node.context;
        let transformedNode = typeof transform === 'function' &&
            transform.call(this, this.trace(node, 'Transform'));
        if (transformedNode) {
            if (transformedNode !== node)
                this.substitution(node, transformedNode);
            return this.trace(transformedNode, 'Transform');
        }
        else {
            return this.trace(node, transform ? 'Ignore' : 'Skip');
        }
    }
    contextualize(node, context, sourceFile) {
        return ((node.context && node.context === context
            || (node.context = context = context || node.context)) &&
            (node.sourceFile && node.sourceFile === sourceFile
                || (node.sourceFile = sourceFile = sourceFile || node.sourceFile || context.sourceFile))) && node || false;
    }
    print(node, sourceFile = node.sourceFile, hint = typescript_utils_1.ts.EmitHint.Unspecified) {
        return node && sourceFile ? this.printer.printNode(hint, node, node.sourceFile) : undefined;
    }
    traverse(node, context = this.context) {
        const traceNode = (node, parentTrace = node && node.trace && node.trace.parent || context.trace || utils_1.trace) => {
            if (node) {
                let { trace: nodeTrace = new utils_1.Trace() } = node || '';
                nodeTrace('[Node]', node), nodeTrace.parent = parentTrace, node.trace = nodeTrace;
            }
            return node;
        };
        return (this.filter ? this.filter(node) : node) && traceNode(node) && (traceNode(node = this.visit(typescript_utils_1.ts.visitEachChild(node, this.visitor, context), context) || node)
            && (context.trace && context.trace(`${'Traverse'}[${typescript_utils_1.SyntaxKind[node.kind]}]`, node.trace.traces)),
            node && traceNode(node = this.transformer(node))) || node;
    }
    substitution(node, substitute, context = this.context) {
        if (substitute.original && substitute.original !== node) {
            const error = Error(`Cannot substitute a node that is already substituted for a different node.`);
            console.warn(error, { node, substitute, context });
            // throw error;
        }
        if (typescript_utils_1.ts['updateNode']) {
            typescript_utils_1.ts['updateNode'](substitute, node);
        }
        else {
            substitute.original === node || typescript_utils_1.ts.setOriginalNode(substitute, node);
            const { pos, end } = node;
            typescript_utils_1.ts.setTextRange(substitute, { pos, end });
        }
        if (enableOriginalText)
            substitute.originalText = node.originalText;
        substitute.transformedText = this.printer.printNode(typescript_utils_1.ts.EmitHint.Unspecified, substitute, context.sourceFile);
        return substitute;
    }
    capture(node) { return Object.assign(Object.create(node), node); }
    trace(node, context, method = utils_1.string(context)) {
        const trace = console.error.bind(console);
        return (node.trace || context.trace || this.context.trace || trace)(`${utils_1.string(method) || 'Trace'}[${typescript_utils_1.SyntaxKind[node.kind]}]`, utils_1.object(context) ? Object.assign({ transformer: this, node }, context) : this.capture(node)), node;
    }
    [typescript_utils_1.SourceFileKind](node, context = this.context) {
        /** @see https://github.com/angular/tsickle/blob/b5834b19ecf8bf31be512eeea9c789b118480fbf/src/transformer_util.ts#L611 */
        // const transformed = node.original && node !== node.original && node.text && node.text === node.original.text && node.originalText && node.originalText !== node.original.originalText;
        return node;
    }
}
CustomTransformer.filter = exports.bypassFilter;
CustomTransformer.transformer = transform;
exports.CustomTransformer = CustomTransformer;
(function (CustomTransformer) {
    CustomTransformer.printer = typescript_utils_1.ts.createPrinter();
    function print(node, sourceFile = node.sourceFile, hint = typescript_utils_1.ts.EmitHint.Unspecified) {
        return node && sourceFile ? this.printer.printNode(hint, node, node.sourceFile) : undefined;
    }
    CustomTransformer.print = print;
    CustomTransformer.contextualize = (node, context, properties) => {
        if (!node || !context)
            return node;
        const { trace: trace, traces } = (context = node.context =
            typeof properties === 'object'
                ? Object.setPrototypeOf(properties, context)
                : Object.create(context)).trace = new utils_1.Trace();
        const { fileName, kind, syntaxKind = typescript_utils_1.SyntaxKind[kind] } = ((context.root = node) || '');
        const sourceFile = context.sourceFile =
            node.kind === typescript_utils_1.SourceFileKind ? node : node.getSourceFile();
        utils_1.Trace.trace(`TransformFile[${fileName || syntaxKind}]`, traces);
        trace('[Context]', context);
        return node;
    };
    CustomTransformer.visitor = (context, transformer) => (node, context = transformer.context) => transformer.visitor(node, context);
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
})(CustomTransformer = exports.CustomTransformer || (exports.CustomTransformer = {}));
// export import CustomFields = CustomTransformer.CustomFields;
exports.print = CustomTransformer.print;
// export import transform = CustomTransformer.transform;
// CustomTransformer.transform = CustomTransformer.transformer;
exports.default = CustomTransformer;
//# sourceMappingURL=custom-transformer.js.map