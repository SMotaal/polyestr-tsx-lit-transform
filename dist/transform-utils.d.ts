import { SourceFile } from './jsx-transformer';
import * as ts from 'typescript';
export declare function transform(filename: string): any;
export declare function transform(sourceFile: SourceFile): any;
export declare function writeFile(sourceFile: SourceFile, filename?: string): string | undefined;
export declare function writeFile(transformedOutput: ts.TransformationResult<SourceFile>, filename?: string): string | undefined;
export declare function readFile(filename: string, languageVersion?: ts.ScriptTarget): SourceFile;
