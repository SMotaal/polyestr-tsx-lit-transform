import { ts, SyntaxKind, Node } from './typescript-utils';
export declare const token: (token: Partial<Token<ts.Node, ts.Node>>) => Token<ts.Node, ts.Node>;
export declare const tags: {
    open: Token<ts.Node, ts.Node>;
    openClosing: Token<ts.Node, ts.Node>;
    close: Token<ts.Node, ts.Node>;
    closeSelfClosing: Token<ts.Node, ts.Node>;
};
export declare const tag: Record<"close" | "open" | "openClosing" | "closeSelfClosing", (token: Partial<Token<ts.Node, ts.Node>>) => Token<ts.Node, ts.Node>>;
export declare enum TokenTypes {
    SpreadAttribute = "spread-attribute",
    AttributeName = "attribute-name",
    AttributeValue = "attribute-value",
    Expression = "expression",
    ClosingTag = "closing-tag",
    OpenTag = "open-tag",
    OpenClosingTag = "open-closing-tag",
    CloseTag = "close-tag",
    CloseSelfClosingTag = "close-self-closing-tag",
    Raw = "raw",
}
export interface Token<T extends Node = Node, U extends Node = T> {
    part?: any;
    node?: T;
    type?: string;
    kind?: SyntaxKind;
    from?: U;
    raw?: string;
}
export declare type tokens = (Token | string | (Token | string)[])[];
export declare const containsJsx: (node: any, {transformFlags}?: any) => any;
export declare const jsxKinds: ts.SyntaxKind[];
export declare const isJsx: (node: any, {kind}?: any) => any;
export declare const getTextFromNode: (node: ts.Node & {
    sourceFile: ts.SourceFile;
}, sourceFile?: ts.SourceFile, includeTrivia?: boolean) => any;
export declare const flatten: (...arrays: any[]) => any;
/**
 * JSX trims whitespace at the end and beginning of lines, except that the
 * start/end of a tag is considered a start/end of a line only if that line is
 * on the same line as the closing tag. See examples in
 * tests/cases/conformance/jsx/tsxReactEmitWhitespace.tsx
 * See also https://www.w3.org/TR/html4/struct/text.html#h-9.1 and https://www.w3.org/TR/CSS2/text.html#white-space-model
 *
 * An equivalent algorithm would be:
 * - If there is only one line, return it.
 * - If there is only whitespace (but multiple lines), return `undefined`.
 * - Split the text into lines.
 * - 'trimRight' the first line, 'trimLeft' the last line, 'trim' middle lines.
 * - Decode entities on each line (individually).
 * - Remove empty lines and join the rest with " ".
 */
export declare function normalizeJsxText(text: string): string | undefined;
/**
 * JSX trims whitespace at the end and beginning of lines, except that the
 * start/end of a tag is considered a start/end of a line only if that line is
 * on the same line as the closing tag. See examples in
 * tests/cases/conformance/jsx/tsxReactEmitWhitespace.tsx
 * See also https://www.w3.org/TR/html4/struct/text.html#h-9.1 and https://www.w3.org/TR/CSS2/text.html#white-space-model
 *
 * An equivalent algorithm would be:
 * - If there is only one line, return it.
 * - If there is only whitespace (but multiple lines), return `undefined`.
 * - Split the text into lines.
 * - 'trimRight' the first line, 'trimLeft' the last line, 'trim' middle lines.
 * - Decode entities on each line (individually).
 * - Remove empty lines and join the rest with " ".
 */
export declare function fixWhitespace(text: string): string | undefined;
export declare function addLineOfJsxText(acc: string | undefined, trimmedLine: string): string;
/**
 * Replace entities like "&nbsp;", "&#123;", and "&#xDEADBEEF;" with the characters they encode.
 * See https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references
 */
export declare function decodeEntities(text: string): string;
/** Like `decodeEntities` but returns `undefined` if there were no entities to decode. */
export declare function tryDecodeEntities(text: string): string | undefined;
export declare const entities: Map<string, number>;
export declare function createMapFromTemplate<T>(template: MapLike<T>): Map<string, T>;
export interface MapLike<T> {
    [index: string]: T;
}
/** Does not include line breaks. For that, see isWhiteSpaceLike. */
export declare function isWhiteSpaceSingleLine(ch: number): boolean;
export declare function isLineBreak(ch: number): boolean;
export declare const enum CharacterCodes {
    nullCharacter = 0,
    maxAsciiCharacter = 127,
    lineFeed = 10,
    carriageReturn = 13,
    lineSeparator = 8232,
    paragraphSeparator = 8233,
    nextLine = 133,
    space = 32,
    nonBreakingSpace = 160,
    enQuad = 8192,
    emQuad = 8193,
    enSpace = 8194,
    emSpace = 8195,
    threePerEmSpace = 8196,
    fourPerEmSpace = 8197,
    sixPerEmSpace = 8198,
    figureSpace = 8199,
    punctuationSpace = 8200,
    thinSpace = 8201,
    hairSpace = 8202,
    zeroWidthSpace = 8203,
    narrowNoBreakSpace = 8239,
    ideographicSpace = 12288,
    mathematicalSpace = 8287,
    ogham = 5760,
    _ = 95,
    $ = 36,
    _0 = 48,
    _1 = 49,
    _2 = 50,
    _3 = 51,
    _4 = 52,
    _5 = 53,
    _6 = 54,
    _7 = 55,
    _8 = 56,
    _9 = 57,
    a = 97,
    b = 98,
    c = 99,
    d = 100,
    e = 101,
    f = 102,
    g = 103,
    h = 104,
    i = 105,
    j = 106,
    k = 107,
    l = 108,
    m = 109,
    n = 110,
    o = 111,
    p = 112,
    q = 113,
    r = 114,
    s = 115,
    t = 116,
    u = 117,
    v = 118,
    w = 119,
    x = 120,
    y = 121,
    z = 122,
    A = 65,
    B = 66,
    C = 67,
    D = 68,
    E = 69,
    F = 70,
    G = 71,
    H = 72,
    I = 73,
    J = 74,
    K = 75,
    L = 76,
    M = 77,
    N = 78,
    O = 79,
    P = 80,
    Q = 81,
    R = 82,
    S = 83,
    T = 84,
    U = 85,
    V = 86,
    W = 87,
    X = 88,
    Y = 89,
    Z = 90,
    ampersand = 38,
    asterisk = 42,
    at = 64,
    backslash = 92,
    backtick = 96,
    bar = 124,
    caret = 94,
    closeBrace = 125,
    closeBracket = 93,
    closeParen = 41,
    colon = 58,
    comma = 44,
    dot = 46,
    doubleQuote = 34,
    equals = 61,
    exclamation = 33,
    greaterThan = 62,
    hash = 35,
    lessThan = 60,
    minus = 45,
    openBrace = 123,
    openBracket = 91,
    openParen = 40,
    percent = 37,
    plus = 43,
    question = 63,
    semicolon = 59,
    singleQuote = 39,
    slash = 47,
    tilde = 126,
    backspace = 8,
    formFeed = 12,
    byteOrderMark = 65279,
    tab = 9,
    verticalTab = 11,
}
