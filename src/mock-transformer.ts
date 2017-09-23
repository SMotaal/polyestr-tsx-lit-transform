import {
    ts, Transformer, TransformFlags, SyntaxKind
} from './typescript-utils';
import { Trace, trace, flatten } from './utils';
import { getTextFromNode } from './jsx-utils';
import CustomTransformer, { Node, TransformationContext, SourceFile, Filter, print, transform, passthroughFilter, bypassFilter } from './custom-transformer';

export { Node, TransformationContext as Context, SourceFile, TransformationResult as Result } from './custom-transformer';

export class MockTransformer<context extends TransformationContext = TransformationContext> extends CustomTransformer {
    static filter: Filter = passthroughFilter;

    static transformer = <T extends Node = SourceFile>(
        context: TransformationContext,
        filter: Filter = passthroughFilter, // bypassFilter, // = TestTransformer.filter,
    ): Transformer<T> => transform(context, MockTransformer, filter && { filter } || undefined);

    [SyntaxKind.SourceFile](node) {
        // [SyntaxKind.TaggedTemplateExpression](node) {
        // console.log({ taggedTemplateExpression: node });
        console.log({ sourceFile: node });
        return node;
    }

    [SyntaxKind.TemplateSpan](node: ts.TemplateSpan | ts.TemplateHead) {
        let substitute = node;

        // this.context.onEmitNode(ts.EmitHint.Unspecified, substitute, (hint, node) => {
        //     console.log('emitNode', ts.EmitHint[hint], node);
        // });

        // const literal = (node['literal'] && node['literal'] || node) as ts.LiteralLikeNode;
        // const text = literal.text.replace(/\n/g, '\r');
        // const literalClone = ts.createLiteral(text);
        // (literalClone as any)['kind'] = literal.kind;


        // if (node === literal) substitute = literalClone;
        // else {
        //     this.substitution(literal, literalClone);
        //     const clone = ts.getMutableClone(node);
        //     clone['literal'] = literalClone;
        //     substitute = clone;
        // }
        // console.log(SyntaxKind[node.kind], { node, substitute });
        return substitute;
    }

    constructor(public context: context) {
        super(context);
        this[SyntaxKind.TemplateHead] = this[SyntaxKind.TemplateSpan];
        this[SyntaxKind.TemplateMiddle] = this[SyntaxKind.TemplateSpan];
        this[SyntaxKind.TemplateTail] = this[SyntaxKind.TemplateSpan];
        context.enableEmitNotification(SyntaxKind.TemplateSpan);
        context.enableEmitNotification(SyntaxKind.TemplateHead);
        context.enableEmitNotification(SyntaxKind.TemplateMiddle);
        context.enableEmitNotification(SyntaxKind.TemplateTail);
    }
}

const { transformer: _transform, filter: _filter } = MockTransformer;
export { _transform as transform, _filter as filter };

export default MockTransformer;
