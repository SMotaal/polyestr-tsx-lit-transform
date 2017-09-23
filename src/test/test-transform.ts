import { ts, Transformer, ScriptTarget, ScriptKind, SyntaxKind } from '../typescript-utils';
import transformer, { Node, Context, SourceFile, Result, MockTransformer } from '..';
import { Trace, trace, traces, now, measure } from '../utils';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { basename, resolve as absolutePath } from 'path';
import * as highlight from 'highlight.js';
import './devtools-formatter';

const useOriginalText = false, useSourceText = true;
const ciFlag = process.argv.indexOf('--ci') > -1;

function test() {
    const scope: any = {};
    trace('[Scope]', scope);

    const sources = scope.sources = [
        // ['index.ts', `
        //     import { template } from './template.tsx';\ndocument.body.append(template('hello', 'Hello World!'));
        // `],
        ['template.ts', `
            import { html, svg } from "../lit-html";
            export const template = ({id = '<id>', text = '<text>'}) => html\`<p hidden id=\${id}><awesome-icon icon='awesome'/>\${text}</p>\`;
        `],
        ['template-1.tsx', `
            import { html, svg } from "../lit-html";
            export const template = ({id = '<id>', text = '<text>'}) => html(<p hidden id={id}><awesome-icon icon='awesome'/>{text}</p>);
        `],
        ['template-2.ts', `
            import { html, svg } from "../lit-html";
            export const template = ({id = '<id>', text = '<text>'}) => html\`
                <div>\${[
                    html\`<p id=\${id}>
                        \${html\`<b>\${name}</b>)}: \${text}
                    </p>\`
                    html\`<p id=\${id}>
                        <b>\${name}</b>: \${text}
                    </p>\`,
                ]}</div>
            \`;
        `],
        ['template-2.tsx', `
            import { html, svg } from "../lit-html";
            export const template = ({id = '<id>', name, text = '<text>'}) => html(
                <div>{[
                    html(<p id={id}>
                        {html(<b>{name}</b>)}: {text}
                    </p>)
                    html(<p id={id}>
                        <b>{name}</b>: {text}
                    </p>),
                ]}</div>
            );
        `],
        // ['stores raw names of attributes']:
        //     () => html(
        //         <div
        //             someProp={1}
        //             a-nother={2}
        //             multiParts={\`\${3} \${4}\`}
        //             <p>{5}</p>
        //             <div aThing={6}></div>
        //         </div>
        //     ),
        ['lit-tests.tsx', `
            import { html, svg } from "../lit-html";
            export const tests = {
                ['escapes marker sequences in text nodes']:
                    () => html(<div>{{}}</div>),
                ['parses expressions for expressions in one element']:
                    () =>  html(<div>{1}{2}</div>),
                ['parses expressions for two attributes of one element']:
                    () =>  html(<div a={1} b={2} c="3"></div>),
                ['parses parts for multiple expressions']:
                    () => html(
                        <div a={1}>
                            <p>{2}</p>
                            {3}
                            <span a={4}>{5}</span>
                        </div>
                    ),
                ['updates when called multiple times with arrays']:
                    (items = ['a', 'b', 'c'].map(item => html(<li>{item}</li>))) =>
                        html(<ul>{items}</ul>),
                ['renders a string']:
                    () => html(<div>{'string'}</div>),
                ['renders a number']:
                    () => html(<div>{123}</div>),
                ['renders a undefined']:
                    () => html(<div>{undefined}</div>),
                ['renders a null']:
                    () => html(<div>{null}</div>),
                ['renders a function']:
                    () => html(<div>{(_: any) => 123}</div>),
                ['renders array as attribute value']:
                    () => html(<div a={[1, 2, 3]}></div>),
                ['renders arrays']:
                    () => html(<div>{[1, 2, 3]}</div>),
                ['renders nested templates']:
                    (partial = html(<h1>{'foo'}</h1>)) =>
                        html(<div>{partial}{'bar'}</div>),
                ['values contain interpolated values']:
                    () => html(<div>{'a'}{'b'}{'c'}</div>),
                ['renders arrays of nested templates']:
                    () => html(<div>{[1, 2, 3].map((i) => html(<span>{i}</span>))}</div>),
                ['renders an element']:
                    (child = document.createElement('p')) =>
                        html(<div>{child}</div>),
                // '': () => html(),
            };
        `],
        ['complex-template.tsx', `
            import { html, svg } from "../lit-html";
            export const html = (strings: TemplateStringsArray, ... values) => ({strings, values});
            export const template = ({id = '<id>', text = '<text>'}) => html(
                html(<h1 hidden id={id}><awesome-icon icon='awesome'/>{text}</h1>),
                html(<div>
                    { ... ['a', 'b', 'c'].map(text => html(<p>{text}</p>)) }
                </div>)
            );
        `],
        ['lit-template.tsx', litTemplate],
        // ['long.ts', `var x = 1;\n${('x=x+1; '.repeat(10) + '\n').repeat(100)}`]
    ] as [string, string, ScriptTarget, boolean, ScriptKind][]; // .map((source: any) => (source[1] = source[1] && reindent(source[1]) || '', source) || source)
    const sourceFiles = scope.sourceFiles =
        sources.map(
            ([fileName, sourceText, languageVersion = ScriptTarget.Latest]) => Object.assign(
                ts.createSourceFile(fileName, sourceText, languageVersion),
                { sourceText, languageVersion }
            )
        );

    // const transformer = scope.transformer = JSXTransformer.transformer;
    const testTransformer = scope.testTransformer = MockTransformer.transformer;

    const transformationResults = scope.transformationResults =
        sourceFiles.map(sourceFile => {
            const _transformer = sourceFile['scriptKind'] === 4 ? transformer : testTransformer;
            // debugger;
            const transfrom = measure(() => ts.transform<SourceFile>(sourceFile, [_transformer]) as Result);
            const result = transfrom(); result.elapsed = transfrom.metrics && transfrom.metrics.elapsed;
            const { transformed: [transformedFile] } = result;
            transformedFile.transformationResult = result;
            result['transformer'] = transformedFile['transformer'] = _transformer;

            // result.dispose();
            // if (sourceFile !== transformedFile) ts.updateSourceFileNode(transformedFile, transformedFile.statements); // debugger;
            return result;
        });

    const transformedFiles = scope.transformedFiles =
        transformationResults.reduce((transformedFiles, transformationResult) => ([...transformedFiles, ...transformationResult.transformed]), []);

    const printer: ts.Printer = scope.printer =
        ts.createPrinter();

    const extensionMatcher = /((?:\..*?|)\.tsx?)$/i;

    const save = (input, output, filename, dirname = outputPath) => {
        try {
            const path = absolutePath(resolveOutputPath(dirname), filename);
            input && writeFileSync(path.replace(extensionMatcher, ' [2]$1'), output || '', { flag: 'w' });
            output && writeFileSync(path, input || '', { flag: 'w' });
        } catch (exception) {
            error(exception);
        }
    };

    const outputs = scope.outputs =
        transformedFiles.map((transformedFile: SourceFile & Node) => {
            trace(`PrintFile[${transformedFile.fileName || SyntaxKind[transformedFile.kind]}]`, { transformedFile });

            const output = useOriginalText && transformedFile.originalText || printer.printFile(transformedFile);
            const { ['original' as any]: sourceFile } = transformedFile;
            const input = sourceFile && (
                (useSourceText && sourceFile['sourceText']) || (useOriginalText && sourceFile.originalText) || printer.printFile(sourceFile)
            ) || '';
            const { fileName: filename } = sourceFile || transformedFile;
            const escapeText = (string: string, title: string, code = highlight.highlightAuto(string.replace(/\\n/g, '\n')), div = document.createElement('div'), fragment = document.createElement('template').content) => [(div.setAttribute('style', 'whitespace: pre'), div.innerHTML = code.value, fragment['type'] = 'highlighted-source-code', fragment['title'] = title, fragment.appendChild(div), fragment)]; // , code new Text(string || '');
            if (inBrowser) {
                group(filename);
                output && log(...escapeText(output, `Output: ${filename}`));
                input && log(...escapeText(input, `Input: ${filename}`));
                groupEnd();
            }
            extensionMatcher.test(filename) && save(input, output, filename);
            if (!sourceFile) return output;
            return { input, output };
        });

    if (inBrowser) log(scope, traces); // debugger;
    else debugger;
}

var outputPath = absolutePath(__dirname, '../../test/generated');
var litTemplate = readFileSync(require.resolve('../../test/static/lit-clock.tsx'), 'utf-8').toString();
var inBrowser = !(typeof window === 'undefined');
var { log, warn, error, info, group, groupEnd } = console;

test();

function resolveOutputPath(dirname = outputPath) {
    if (dirname !== outputPath) dirname = absolutePath(__dirname, outputPath);
    if (!existsSync(dirname)) mkdirSync(dirname);
    return dirname;
}
