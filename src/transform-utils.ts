import { SourceFile, JSXTransformer, Result, transform as transformer } from './jsx-transformer';
import * as ts from 'typescript';
import { basename, resolve as absolutePath } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';

const resolvedPaths = new Map<string, boolean>();
const resolvePath = (filename) => absolutePath(process.cwd(), filename);
const exists = (path) => resolvedPaths.get(path)
    || (resolvedPaths.set(path, existsSync(path)), resolvedPaths.get(path));
const extensionMatcher = /((?:\..*?|)\.tsx?)$/i;

export function transform(filename: string);
export function transform(sourceFile: SourceFile);
export function transform(source: SourceFile | string) {
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

    const result = ts.transform<SourceFile>(sourceFile, [transformer]) as Result;

    const { transformed: [transformedFile] } = result;

    if (transformedFile && transformedFile.fileName === sourceFile.fileName)
        transformedFile.fileName = transformedFile.fileName.replace(extensionMatcher, ' [out]$1')

    return result;
}

let printer: ts.Printer; // ts.createPrinter();

export function writeFile(sourceFile: SourceFile, filename?: string): string | undefined;
export function writeFile(transformedOutput: ts.TransformationResult<SourceFile>, filename?: string): string | undefined;
export function writeFile(source, filename?: string): string | undefined {
    if (source && source.transformed && source.transformed.length) {
        return writeFile(source.transformed[0], filename);
    }

    const sourceFile: SourceFile = source && source.kind === ts.SyntaxKind.SourceFile && source;
    filename = filename || source && sourceFile.fileName;
    if (!sourceFile || !filename) return;
    const output = (printer = printer || ts.createPrinter()).printFile(sourceFile);
    writeFileSync(filename, output || '', { flag: 'w' });
    return filename;
}

export function readFile(filename: string, languageVersion = ts.ScriptTarget.Latest): SourceFile {
    const path = resolvePath(filename);

    if (!exists(path))
        throw Error(`Cannot load "${filename}" since it does not exist at the resolved path "${path}".`);

    const sourceText = readFileSync(filename, 'utf-8').toString();
    const sourceFile = ts.createSourceFile(filename, sourceText, languageVersion);

    return sourceFile as SourceFile;
}
