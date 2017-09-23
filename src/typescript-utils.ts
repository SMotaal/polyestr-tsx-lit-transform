
/** TYPE-SCRIPT **/
import * as typescript from 'typescript';
export { typescript, typescript as ts };

/** TYPE-SCRIPT::TYPES **/
export import TransformationContext = typescript.TransformationContext;
export import Node = typescript.Node;
export import SourceFile = typescript.SourceFile;
export import SourceFileLike = typescript.SourceFileLike;
export import Transformer = typescript.Transformer;
export import Visitor = typescript.Visitor;
export import VisitResult = typescript.VisitResult;
export import CompilerOptions = typescript.CompilerOptions;

export import ScriptTarget = typescript.ScriptTarget;
export import ScriptKind = typescript.ScriptKind;
export import SyntaxKind = typescript.SyntaxKind;
export const { TransformFlags = {} as any, TransformFlags: { ContainsJsx = 1 << 2 } } = typescript as any;
export const {
    // StringLiteral,
    // JsxElement, JsxOpeningElement, JsxClosingElement, JsxSelfClosingElement,
    // JsxExpression, JsxAttributes, JsxAttribute, JsxSpreadAttribute, JsxText, JsxTextAllWhiteSpaces,
} = SyntaxKind;

export const {
    SourceFile: SourceFileKind,
    StringLiteral: StringLiteralKind,
    CallExpression: CallExpressionKind,
    JsxOpeningElement: JsxOpeningElementKind,
    JsxClosingElement: JsxClosingElementKind,
    JsxSelfClosingElement: JsxSelfClosingElementKind,
    JsxExpression: JsxExpressionKind,
    JsxElement: JsxElementKind,
    JsxAttributes: JsxAttributesKind,
    JsxAttribute: JsxAttributeKind,
    JsxSpreadAttribute: JsxSpreadAttributeKind,
    JsxText: JsxTextKind,
    JsxTextAllWhiteSpaces: JsxTextAllWhiteSpacesKind,
    TemplateHead: TemplateHeadKind, TemplateMiddle: TemplateMiddleKind, TemplateTail: TemplateTailKind,
} = SyntaxKind;

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
