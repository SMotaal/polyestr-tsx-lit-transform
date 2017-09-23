import {
    ts, Transformer, TransformFlags, ContainsJsx,
    SyntaxKind, SourceFileKind, CallExpressionKind,
    JsxExpressionKind, JsxElementKind, JsxAttributeKind, JsxTextKind,
    JsxOpeningElementKind, JsxClosingElementKind, JsxSelfClosingElementKind,
    JsxAttributesKind, JsxSpreadAttributeKind, JsxTextAllWhiteSpacesKind,
    TemplateHeadKind, TemplateMiddleKind, TemplateTailKind,
} from './typescript-utils';
import { Trace, trace, flatten } from './utils';
import {
    getTextFromNode, normalizeJsxText, decodeEntities, fixWhitespace, isJsx, containsJsx,
    token, tokens, tag
} from './jsx-utils';
import CustomTransformer, { Node, TransformationContext, SourceFile, Filter, print, transform } from './custom-transformer';

export { Node, TransformationContext as Context, SourceFile, TransformationResult as Result } from './custom-transformer';

export class JSXTransformer extends CustomTransformer {
    static templateTags = ['html', 'svg'];

    static filter: Filter = (node: Node) =>
        node && (
            containsJsx(node)
            || isJsx(node)
            || (node.kind === SourceFileKind && node['scriptKind'] === 4)
        ) && node;

    static transformer = <T extends Node = SourceFile>(
        context: TransformationContext,
        filter?: Filter,
    ): Transformer<T> => transform(context, JSXTransformer, filter && { filter } || undefined);

    constructor(context: CustomTransformer['context']) {
        super(context);
        this[JsxSelfClosingElementKind] = this[JsxOpeningElementKind];
        this[JsxTextAllWhiteSpacesKind] = this[JsxTextKind];
    }

    [JsxTextKind](node) {
        const text = normalizeJsxText(getTextFromNode(node) || '');
        const tokens: tokens = node.templateTokens = [token({ node, part: text, type: 'raw' })];
        return node;
    }

    [JsxSpreadAttributeKind](node, from = node) {
        // Spread attributes are not supported
        console.warn('Unsupported JSX feature: JsxSpreadAttributeKind', node, this);
        // const tokens: tokens = node.templateTokens = [token({ node, part: node.originalText || undefined, type: 'spread-attribute' })];
        return node;
    }

    [JsxExpressionKind](node, from = node) {
        const { expression: expressionNode } = node;

        // Make sure we have an node.expression
        if (!expressionNode) return node;

        // Map expressionNode.templateTokens to node.templateTokens
        const {
            escapedText: text,
            templateTokens: expressionTokens = [token({ node: expressionNode, from, part: expressionNode, type: 'expression' })]
        } = expressionNode;

        const tokens: tokens = node.templateTokens = expressionTokens && expressionTokens.length ? [...expressionTokens] : []; //  [noken{ string: text, from: expression }];
        // console.log(`JsxExpression: ${originalText || text}\n\tnodes: %O\ttokens: %O`, node, tokens);
        return node;
    }

    [JsxAttributeKind](node: ts.JsxAttribute & Node, from = node) {
        const { name: nameNode, initializer: initializerNode = undefined } = node as Node & { name: Node, initializer?: Node };
        const { text: nameText, escapedText: name = (nameText || '') as string } = nameNode || '' as any;

        // Make sure we have a node.name
        if (!name) return node;

        // Map namneNode.escapedText (or text) to node.templateTokens
        const tokens: tokens = node.templateTokens =
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

    [JsxAttributesKind](node, from = node) {
        const { properties: attributeNodes = '' as any as Node[] } = node as (Node & { properties: Node[] });

        // Make sure we have nodes in node.properties
        if (!attributeNodes.length) return node;

        // Map attributeNodes[i].templateTokens to node.templateTokens
        const tokens: tokens = node.templateTokens = [];
        for (const attributeNode of attributeNodes) {
            const { templateTokens: attributeTokens = '' as any as tokens } = attributeNode;
            attributeTokens.length && (
                tokens.length
                    ? tokens.push({ raw: ' ', from }, ...attributeTokens)
                    : tokens.push(...attributeTokens)
            );
        }

        return node;
    }

    [JsxClosingElementKind](node, from = node) {
        const { tagName: nameNode = '' as any } = node as (Node & { attributes: Node, tagName: Node });
        const { escapedText: escapedName, text: nameText } = nameNode as (Node & { escapedText?: string, text?: string });
        const tagName = escapedName || nameText;

        // Make sure we have a tagName from node.tagName
        if (!tagName) return node;

        // Map namneNode.escapedText (or text) to node.templateTokens
        const tokens: tokens = node.templateTokens = [token({ node, raw: `</${tagName}>`, type: 'closing-tag' })];

        return node;
    }

    [JsxOpeningElementKind](node, from = node) {
        const { attributes: attributesNode = '' as any, tagName: nameNode = '' as any } = node as (Node & { attributes: Node, tagName: Node });
        const { templateTokens: attributesTokens = '' as any as tokens } = attributesNode;
        const { escapedText: escapedName, text: nameText } = nameNode as (Node & { escapedText?: string, text?: string });
        const tagName = escapedName || nameText;

        // Make sure we have a tagName from node.tagName
        if (!tagName) return node;

        /** Node will be selfClosing if call was delegated from this[JsxSelfClosingElementKind] */
        const selfClosing = node.kind === JsxSelfClosingElementKind;

        const tokens: tokens = node.templateTokens = [tag.open({ node, raw: `<${tagName}` })];
        attributesTokens.length && tokens.push({ raw: ' ', from }, ...attributesTokens);
        tokens.push(selfClosing ? tag.closeSelfClosing({ node }) : tag.close({ node }));

        return node;
    }

    [JsxElementKind](node) {
        const tokens: tokens = node.templateTokens = [];
        const { openingElement: openingNode = '' as any as Node, closingElement: closingNode = '' as any, children: childNodes = '' as any as Node[] } = node as Node & { openingElement?: Node, closingElement?: Node, children?: Node[] };

        /** Element will be valid if it has opening and closing elements or a self-closing opening element  */
        const validElement = openingNode && (closingNode || openingNode.kind !== JsxSelfClosingElementKind);

        // Make sure we have a closed element with at least some tokens in openingNode
        if (!validElement || !openingNode.templateTokens) return node;

        tokens.push(...openingNode.templateTokens); // openingNode.templateTokens &&

        for (const { templateTokens: childTokens = '' as any as tokens } of childNodes) // if (childNodes.length)
            childTokens.length && tokens.push(...childTokens);

        const { templateTokens: closingTokens = '' as any as tokens } = closingNode || '' as any as Node;
        closingTokens.length && tokens.push(...closingNode.templateTokens);

        return node;
    }

    [CallExpressionKind](callExpressionNode: Node, context = this.context as TransformationContext) {
        const {
            arguments: argumentNodes = [], expression: { escapedText: templateTag = '' as string } = '' as any,
            expression: expressionNode
        } = callExpressionNode as Node & { arguments: Node[], expression: Node & { escapedText: string } };
        const [argument] = argumentNodes;

        if (argumentNodes.length === 1 && JSXTransformer.templateTags.includes(templateTag)) {
            if (argument.templateString) callExpressionNode.templateString = `${templateTag}\`${argument.templateString}\``;
            if (argument.templateTokens) {
                const tokens = flatten(...argument.templateTokens);

                const synthesizedTemplate = tokens.reduceRight((result: { string: string[], tail?: Node, nodes: any, spans: { expression: Node, string: string, from: Node }[] } & any, token: any, index, { length }) => {
                    let { raw, part = raw || undefined, type, node, from = node } = token;
                    const head = index === 0;
                    if (type !== 'expression') result.string.push(part || '');

                    if (type === 'expression' || head) {
                        const { string: _string, string: { length: _length }, nodes, spans } = result;
                        let expression = node, string = _length && _string.reverse().join('') || '';
                        result.string = [];

                        if (head) {

                            const templateHead: ts.TemplateHead = nodes.templateHead = ts.createLiteral(string) as any;
                            from && this.substitution(from, templateHead)
                            templateHead.kind = TemplateHeadKind;

                            const templateSpans: ts.TemplateSpan[] = nodes.templateSpans = [...result.spans].reverse().map(({ expression, string, from }, index, { length }) => {

                                const literal = ts.createLiteral(string) as any;
                                literal.kind = index === length - 1 ? TemplateTailKind : TemplateMiddleKind;

                                const span = ts.createTemplateSpan(expression, literal);
                                from && this.substitution(from, span);

                                return span;
                            }) as any;

                            const templateExpression = nodes.templateExpression = ts.createTemplateExpression(templateHead, templateSpans);
                            this.substitution(argumentNodes, templateExpression);

                            const templateTagIdentifier = nodes.templateTagIdentifier = ts.createIdentifier(templateTag);
                            this.substitution(expressionNode, templateTagIdentifier);

                            const taggedTemplateExpression = nodes.taggedTemplateExpression = ts.createTaggedTemplate(templateTagIdentifier, templateExpression);
                            this.substitution(callExpressionNode, taggedTemplateExpression);

                        } else {
                            spans.push({ expression, string: string.replace(/\\n/g, '\n'), from });
                        }
                    }

                    return result;
                }, { string: [], spans: [], nodes: {}, tokens })

                const taggedTemplateExpression = synthesizedTemplate.nodes.taggedTemplateExpression;
                const substitution = callExpressionNode['substitution'] = {
                    callExpressionNode,
                    taggedTemplateExpression: synthesizedTemplate.nodes.taggedTemplateExpression,
                    nestedTokens: argument.templateTokens,
                    ...synthesizedTemplate,
                }

                return taggedTemplateExpression;
            }
        }

        return callExpressionNode;
    }

}

const { transformer: _transform, filter: _filter } = JSXTransformer;
export { _transform as transform, _filter as filter };

export default JSXTransformer;
