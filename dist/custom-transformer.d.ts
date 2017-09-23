import { ts, Transformer } from './typescript-utils';
import { Metrics } from './utils';
import Context = CustomTransformer.TransformationContext;
export declare const bypassFilter: Filter;
export declare const passthroughFilter: Filter;
export declare function transform<T extends Node = SourceFile>(this: typeof CustomTransformer | void, context: Context, Transformer?: typeof CustomTransformer, {filter}?: {
    filter?: Filter;
}): Transformer<T>;
export declare class CustomTransformer {
    context: Context;
    static filter: Filter;
    static transformer: (<T extends Node = SourceFile>(context: Context, ...args) => Transformer<T>) | (<T extends Node = SourceFile>(context: TransformationContext, Transformer?: typeof CustomTransformer, {filter}?: {
        filter?: Filter;
    }) => Transformer<T>) | (<T extends Node = SourceFile>(context: TransformationContext, filter?: Filter) => Transformer<T>);
    filter?: Filter;
    printer: ts.Printer;
    constructor(context: Context);
    visitor(node: any, context?: Context): ts.VisitResult<ts.Node>;
    visit(node: any, context?: Context): ts.VisitResult<ts.Node>;
    transformer(node: Node & {
        context: Context;
    }, transform?: any): any;
    contextualize<node extends Node>(node: node & {
        context: Context;
    }): node | false;
    contextualize<node extends Node>(node: node, context: Context): node | false;
    print(node: any, sourceFile?: any, hint?: ts.EmitHint): string;
    traverse(node: any, context?: Context): any;
    substitution(node: any, substitute: any, context?: Context): any;
    capture(node: any): any;
    trace(node: Node, context?: Context | string | object): any;
    trace(node: Node, context: Context | object, method?: 'Trace' | string): any;
}
export declare namespace CustomTransformer {
    const printer: ts.Printer;
    function print(node: any, sourceFile?: any, hint?: ts.EmitHint): any;
    const contextualize: (node: Node, context: TransformationContext, properties?: object) => Node;
    const visitor: <T extends Node>(context: any, transformer: CustomTransformer) => (node: any, context?: TransformationContext) => ts.VisitResult<ts.Node>;
}
export declare namespace CustomTransformer {
    type SourceFileNode = ts.SourceFile & Node;
    interface TransformationResult<T extends Node = SourceFile> extends ts.TransformationResult<T>, CustomFields {
        elapsed?: number;
        transformed: T[];
        metrics?: Metrics;
    }
    interface SourceFile extends SourceFileNode {
        transformationResult?: TransformationResult<any>;
    }
    interface TransformationContext extends ts.TransformationContext, CustomFields {
        node?: Node;
        [name: string]: any;
        root?: Node;
    }
    interface Node extends ts.Node, CustomFields {
        originalText?: string;
        text?: string;
        escapedText?: string;
        context?: TransformationContext;
        templateString?: string;
        templateTokens?: any;
    }
    interface CustomFields {
        sourceFile?: SourceFile;
        context?: TransformationContext;
        parentNode?: Node;
        parentContext?: TransformationContext;
        trace?: <T>(heading: string, context: T) => T;
        metrics?: Metrics;
    }
    type Filter<T extends Node = Node> = (node: T) => T | false;
}
export import TransformationContext = CustomTransformer.TransformationContext;
export import TransformationResult = CustomTransformer.TransformationResult;
export import SourceFile = CustomTransformer.SourceFile;
export import Node = CustomTransformer.Node;
export import Filter = CustomTransformer.Filter;
export import print = CustomTransformer.print;
export default CustomTransformer;
