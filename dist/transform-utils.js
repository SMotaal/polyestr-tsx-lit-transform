"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_transformer_1 = require("./jsx-transformer");
const ts = require("typescript");
const path_1 = require("path");
const fs_1 = require("fs");
const resolvedPaths = new Map();
const resolvePath = (filename) => path_1.resolve(process.cwd(), filename);
const exists = (path) => resolvedPaths.get(path)
    || (resolvedPaths.set(path, fs_1.existsSync(path)), resolvedPaths.get(path));
const extensionMatcher = /((?:\..*?|)\.tsx?)$/i;
function transform(source) {
    let filename = typeof source === 'string' ? source : source && source.fileName;
    let sourceFile = typeof source === 'object' && source.kind === ts.SyntaxKind.SourceFile && source;
    if (source === filename) {
        filename = resolvePath(filename);
        if (!exists(filename))
            throw Error(`Cannot transform "${source}" since it does not exist at the resolved path "${filename}".`);
        // If loadFile throws it is a typescript-related issue since we've already ensure the file exists.
        sourceFile = readFile(filename);
    }
    if (!sourceFile)
        throw ReferenceError(`Cannot transform "${filename || '<unknown file>'}" since it does not resolve to a valid SourceFile node.`);
    const result = ts.transform(sourceFile, [jsx_transformer_1.transform]);
    const { transformed: [transformedFile] } = result;
    if (transformedFile && transformedFile.fileName === sourceFile.fileName)
        transformedFile.fileName = transformedFile.fileName.replace(extensionMatcher, ' [out]$1');
    return result;
}
exports.transform = transform;
let printer; // ts.createPrinter();
function writeFile(source, filename) {
    if (source && source.transformed && source.transformed.length) {
        return writeFile(source.transformed[0], filename);
    }
    const sourceFile = source && source.kind === ts.SyntaxKind.SourceFile && source;
    filename = filename || source && sourceFile.fileName;
    if (!sourceFile || !filename)
        return;
    const output = (printer = printer || ts.createPrinter()).printFile(sourceFile);
    fs_1.writeFileSync(filename, output || '', { flag: 'w' });
    return filename;
}
exports.writeFile = writeFile;
function readFile(filename, languageVersion = ts.ScriptTarget.Latest) {
    const path = resolvePath(filename);
    if (!exists(path))
        throw Error(`Cannot load "${filename}" since it does not exist at the resolved path "${path}".`);
    const sourceText = fs_1.readFileSync(filename, 'utf-8').toString();
    const sourceFile = ts.createSourceFile(filename, sourceText, languageVersion);
    return sourceFile;
}
exports.readFile = readFile;
//# sourceMappingURL=transform-utils.js.map