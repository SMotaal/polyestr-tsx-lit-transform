"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_utils_1 = require("./typescript-utils");
const utils_1 = require("./utils");
const jsx_utils_1 = require("./jsx-utils");
const custom_transformer_1 = require("./custom-transformer");
class JSXTransformer extends custom_transformer_1.default {
    constructor(context) {
        super(context);
        this[typescript_utils_1.JsxSelfClosingElementKind] = this[typescript_utils_1.JsxOpeningElementKind];
        this[typescript_utils_1.JsxTextAllWhiteSpacesKind] = this[typescript_utils_1.JsxTextKind];
    }
    [typescript_utils_1.JsxTextKind](node) {
        const text = jsx_utils_1.normalizeJsxText(jsx_utils_1.getTextFromNode(node) || '');
        const tokens = node.templateTokens = [jsx_utils_1.token({ node, part: text, type: 'raw' })];
        return node;
    }
    [typescript_utils_1.JsxSpreadAttributeKind](node, from = node) {
        // Spread attributes are not supported
        console.warn('Unsupported JSX feature: JsxSpreadAttributeKind', node, this);
        // const tokens: tokens = node.templateTokens = [token({ node, part: node.originalText || undefined, type: 'spread-attribute' })];
        return node;
    }
    [typescript_utils_1.JsxExpressionKind](node, from = node) {
        const { expression: expressionNode } = node;
        // Make sure we have an node.expression
        if (!expressionNode)
            return node;
        // Map expressionNode.templateTokens to node.templateTokens
        const { escapedText: text, templateTokens: expressionTokens = [jsx_utils_1.token({ node: expressionNode, from, part: expressionNode, type: 'expression' })] } = expressionNode;
        const tokens = node.templateTokens = expressionTokens && expressionTokens.length ? [...expressionTokens] : []; //  [noken{ string: text, from: expression }];
        // console.log(`JsxExpression: ${originalText || text}\n\tnodes: %O\ttokens: %O`, node, tokens);
        return node;
    }
    [typescript_utils_1.JsxAttributeKind](node, from = node) {
        const { name: nameNode, initializer: initializerNode = undefined } = node;
        const { text: nameText, escapedText: name = (nameText || '') } = nameNode || '';
        // Make sure we have a node.name
        if (!name)
            return node;
        // Map namneNode.escapedText (or text) to node.templateTokens
        const tokens = node.templateTokens =
            [{ node: nameNode, from, part: name, type: 'attribute-name' }];
        // Map initializerNode.templateTokens to node.templateTokens
        if (initializerNode) {
            const initializerTokens = initializerNode.templateTokens
                ? [...initializerNode.templateTokens]
                : initializerNode.text && { node: initializerNode, from, part: `"${initializerNode.text}"`, type: 'attribute-value' };
            initializerTokens && tokens.push({ raw: '=', from }, initializerTokens);
        }
        return node;
    }
    [typescript_utils_1.JsxAttributesKind](node, from = node) {
        const { properties: attributeNodes = '' } = node;
        // Make sure we have nodes in node.properties
        if (!attributeNodes.length)
            return node;
        // Map attributeNodes[i].templateTokens to node.templateTokens
        const tokens = node.templateTokens = [];
        for (const attributeNode of attributeNodes) {
            const { templateTokens: attributeTokens = '' } = attributeNode;
            attributeTokens.length && (tokens.length
                ? tokens.push({ raw: ' ', from }, ...attributeTokens)
                : tokens.push(...attributeTokens));
        }
        return node;
    }
    [typescript_utils_1.JsxClosingElementKind](node, from = node) {
        const { tagName: nameNode = '' } = node;
        const { escapedText: escapedName, text: nameText } = nameNode;
        const tagName = escapedName || nameText;
        // Make sure we have a tagName from node.tagName
        if (!tagName)
            return node;
        // Map namneNode.escapedText (or text) to node.templateTokens
        const tokens = node.templateTokens = [jsx_utils_1.token({ node, raw: `</${tagName}>`, type: 'closing-tag' })];
        return node;
    }
    [typescript_utils_1.JsxOpeningElementKind](node, from = node) {
        const { attributes: attributesNode = '', tagName: nameNode = '' } = node;
        const { templateTokens: attributesTokens = '' } = attributesNode;
        const { escapedText: escapedName, text: nameText } = nameNode;
        const tagName = escapedName || nameText;
        // Make sure we have a tagName from node.tagName
        if (!tagName)
            return node;
        /** Node will be selfClosing if call was delegated from this[JsxSelfClosingElementKind] */
        const selfClosing = node.kind === typescript_utils_1.JsxSelfClosingElementKind;
        const tokens = node.templateTokens = [jsx_utils_1.tag.open({ node, raw: `<${tagName}` })];
        attributesTokens.length && tokens.push({ raw: ' ', from }, ...attributesTokens);
        tokens.push(selfClosing ? jsx_utils_1.tag.closeSelfClosing({ node }) : jsx_utils_1.tag.close({ node }));
        return node;
    }
    [typescript_utils_1.JsxElementKind](node) {
        const tokens = node.templateTokens = [];
        const { openingElement: openingNode = '', closingElement: closingNode = '', children: childNodes = '' } = node;
        /** Element will be valid if it has opening and closing elements or a self-closing opening element  */
        const validElement = openingNode && (closingNode || openingNode.kind !== typescript_utils_1.JsxSelfClosingElementKind);
        // Make sure we have a closed element with at least some tokens in openingNode
        if (!validElement || !openingNode.templateTokens)
            return node;
        tokens.push(...openingNode.templateTokens); // openingNode.templateTokens &&
        for (const { templateTokens: childTokens = '' } of childNodes)
            childTokens.length && tokens.push(...childTokens);
        const { templateTokens: closingTokens = '' } = closingNode || '';
        closingTokens.length && tokens.push(...closingNode.templateTokens);
        return node;
    }
    [typescript_utils_1.CallExpressionKind](callExpressionNode, context = this.context) {
        const { arguments: argumentNodes = [], expression: { escapedText: templateTag = '' } = '', expression: expressionNode } = callExpressionNode;
        const [argument] = argumentNodes;
        if (argumentNodes.length === 1 && JSXTransformer.templateTags.includes(templateTag)) {
            if (argument.templateString)
                callExpressionNode.templateString = `${templateTag}\`${argument.templateString}\``;
            if (argument.templateTokens) {
                const tokens = utils_1.flatten(...argument.templateTokens);
                const synthesizedTemplate = tokens.reduceRight((result, token, index, { length }) => {
                    let { raw, part = raw || undefined, type, node, from = node } = token;
                    const head = index === 0;
                    if (type !== 'expression')
                        result.string.push(part || '');
                    if (type === 'expression' || head) {
                        const { string: _string, string: { length: _length }, nodes, spans } = result;
                        let expression = node, string = _length && _string.reverse().join('') || '';
                        result.string = [];
                        if (head) {
                            const templateHead = nodes.templateHead = typescript_utils_1.ts.createLiteral(string);
                            from && this.substitution(from, templateHead);
                            templateHead.kind = typescript_utils_1.TemplateHeadKind;
                            const templateSpans = nodes.templateSpans = [...result.spans].reverse().map(({ expression, string, from }, index, { length }) => {
                                const literal = typescript_utils_1.ts.createLiteral(string);
                                literal.kind = index === length - 1 ? typescript_utils_1.TemplateTailKind : typescript_utils_1.TemplateMiddleKind;
                                const span = typescript_utils_1.ts.createTemplateSpan(expression, literal);
                                from && this.substitution(from, span);
                                return span;
                            });
                            const templateExpression = nodes.templateExpression = typescript_utils_1.ts.createTemplateExpression(templateHead, templateSpans);
                            this.substitution(argumentNodes, templateExpression);
                            const templateTagIdentifier = nodes.templateTagIdentifier = typescript_utils_1.ts.createIdentifier(templateTag);
                            this.substitution(expressionNode, templateTagIdentifier);
                            const taggedTemplateExpression = nodes.taggedTemplateExpression = typescript_utils_1.ts.createTaggedTemplate(templateTagIdentifier, templateExpression);
                            this.substitution(callExpressionNode, taggedTemplateExpression);
                        }
                        else {
                            spans.push({ expression, string: string.replace(/\\n/g, '\n'), from });
                        }
                    }
                    return result;
                }, { string: [], spans: [], nodes: {}, tokens });
                const taggedTemplateExpression = synthesizedTemplate.nodes.taggedTemplateExpression;
                const substitution = callExpressionNode['substitution'] = Object.assign({ callExpressionNode, taggedTemplateExpression: synthesizedTemplate.nodes.taggedTemplateExpression, nestedTokens: argument.templateTokens }, synthesizedTemplate);
                return taggedTemplateExpression;
            }
        }
        return callExpressionNode;
    }
}
JSXTransformer.templateTags = ['html', 'svg'];
JSXTransformer.filter = (node) => node && (jsx_utils_1.containsJsx(node)
    || jsx_utils_1.isJsx(node)
    || (node.kind === typescript_utils_1.SourceFileKind && node['scriptKind'] === 4)) && node;
JSXTransformer.transformer = (context, filter) => custom_transformer_1.transform(context, JSXTransformer, filter && { filter } || undefined);
exports.JSXTransformer = JSXTransformer;
const { transformer: _transform, filter: _filter } = JSXTransformer;
exports.transform = _transform;
exports.filter = _filter;
exports.default = JSXTransformer;
//# sourceMappingURL=jsx-transformer.js.map