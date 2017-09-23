"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** TYPE-SCRIPT **/
const typescript = require("typescript");
exports.typescript = typescript;
exports.ts = typescript;
exports.ScriptTarget = typescript.ScriptTarget;
exports.ScriptKind = typescript.ScriptKind;
exports.SyntaxKind = typescript.SyntaxKind;
_a = typescript, _b = _a.TransformFlags, exports.TransformFlags = _b === void 0 ? {} : _b, _c = _a.TransformFlags.ContainsJsx, exports.ContainsJsx = _c === void 0 ? 1 << 2 : _c;
_d = exports.SyntaxKind;
exports.SourceFileKind = exports.SyntaxKind.SourceFile, exports.StringLiteralKind = exports.SyntaxKind.StringLiteral, exports.CallExpressionKind = exports.SyntaxKind.CallExpression, exports.JsxOpeningElementKind = exports.SyntaxKind.JsxOpeningElement, exports.JsxClosingElementKind = exports.SyntaxKind.JsxClosingElement, exports.JsxSelfClosingElementKind = exports.SyntaxKind.JsxSelfClosingElement, exports.JsxExpressionKind = exports.SyntaxKind.JsxExpression, exports.JsxElementKind = exports.SyntaxKind.JsxElement, exports.JsxAttributesKind = exports.SyntaxKind.JsxAttributes, exports.JsxAttributeKind = exports.SyntaxKind.JsxAttribute, exports.JsxSpreadAttributeKind = exports.SyntaxKind.JsxSpreadAttribute, exports.JsxTextKind = exports.SyntaxKind.JsxText, exports.JsxTextAllWhiteSpacesKind = exports.SyntaxKind.JsxTextAllWhiteSpaces, exports.TemplateHeadKind = exports.SyntaxKind.TemplateHead, exports.TemplateMiddleKind = exports.SyntaxKind.TemplateMiddle, exports.TemplateTailKind = exports.SyntaxKind.TemplateTail;
var _a, _b, _c, _d;
// /** TS-SIMPLE-AST **/
// export * from "ts-simple-ast"; // exports compiler, structures, FileSystemHost, ManipulationSettings
// export * from "ts-simple-ast/dist/utils";
// export * from "ts-simple-ast/dist/errors";
// export * from "ts-simple-ast/dist/errors";
// import * as ast from "ts-simple-ast"; // exports compiler, structures, FileSystemHost, ManipulationSettings
// export { ast };
// /** TS-SIMPLE-AST::TYPEG-UARDS **/
// import { TypeGuards } from "ts-simple-ast";
// export const { isAbstractableNode, isAmbientableNode, isArgumentedNode, isArrayLiteralExpression, isAsyncableNode, isBindingNamedNode, isBodiedNode, isBodyableNode, isCallExpression, isClassDeclaration, isConstructSignatureDeclaration, isConstructorDeclaration, isDeclarationNamedNode, isDecoratableNode, isDecorator, isDocumentationableNode, isEnumDeclaration, isEnumMember, isExportDeclaration, isExportSpecifier, isExportableNode, isExpression, isExpressionWithTypeArguments, isExtendsClauseableNode, isFunctionDeclaration, isFunctionLikeDeclaration, isGeneratorableNode, isGetAccessorDeclaration, isHeritageClause, isHeritageClauseableNode, isIdentifier, isImplementsClauseableNode, isImportDeclaration, isImportSpecifier, isInitializerExpressionableNode, isInterfaceDeclaration, isJSDoc, isMethodDeclaration, isMethodSignature, isModifierableNode, isNamedNode, isNamespaceChildableNode, isNamespaceDeclaration, isOverloadableNode, isParameterDeclaration, isParameteredNode, isPropertyDeclaration, isPropertyNamedNode, isPropertySignature, isQuestionTokenableNode, isReadonlyableNode, isReturnTypedNode, isScopeableNode, isScopedNode, isSetAccessorDeclaration, isSignaturedDeclaration, isSourceFile, isStatementedNode, isStaticableNode, isTextInsertableNode, isTypeAliasDeclaration, isTypeArgumentedNode, isTypeParameterDeclaration, isTypeParameteredNode, isTypedNode, isVariableDeclaration, isVariableDeclarationList, isVariableStatement } = TypeGuards;
//# sourceMappingURL=typescript-utils.js.map