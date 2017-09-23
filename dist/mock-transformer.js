"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_utils_1 = require("./typescript-utils");
const custom_transformer_1 = require("./custom-transformer");
class MockTransformer extends custom_transformer_1.default {
    constructor(context) {
        super(context);
        this.context = context;
        this[typescript_utils_1.SyntaxKind.TemplateHead] = this[typescript_utils_1.SyntaxKind.TemplateSpan];
        this[typescript_utils_1.SyntaxKind.TemplateMiddle] = this[typescript_utils_1.SyntaxKind.TemplateSpan];
        this[typescript_utils_1.SyntaxKind.TemplateTail] = this[typescript_utils_1.SyntaxKind.TemplateSpan];
        context.enableEmitNotification(typescript_utils_1.SyntaxKind.TemplateSpan);
        context.enableEmitNotification(typescript_utils_1.SyntaxKind.TemplateHead);
        context.enableEmitNotification(typescript_utils_1.SyntaxKind.TemplateMiddle);
        context.enableEmitNotification(typescript_utils_1.SyntaxKind.TemplateTail);
    }
    [typescript_utils_1.SyntaxKind.SourceFile](node) {
        // [SyntaxKind.TaggedTemplateExpression](node) {
        // console.log({ taggedTemplateExpression: node });
        console.log({ sourceFile: node });
        return node;
    }
    [typescript_utils_1.SyntaxKind.TemplateSpan](node) {
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
}
MockTransformer.filter = custom_transformer_1.passthroughFilter;
MockTransformer.transformer = (context, filter = custom_transformer_1.passthroughFilter) => custom_transformer_1.transform(context, MockTransformer, filter && { filter } || undefined);
exports.MockTransformer = MockTransformer;
const { transformer: _transform, filter: _filter } = MockTransformer;
exports.transform = _transform;
exports.filter = _filter;
exports.default = MockTransformer;
//# sourceMappingURL=mock-transformer.js.map