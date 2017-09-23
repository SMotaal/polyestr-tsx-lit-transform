"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_utils_1 = require("../typescript-utils");
const __1 = require("..");
const utils_1 = require("../utils");
const fs_1 = require("fs");
const path_1 = require("path");
const highlight = require("highlight.js");
require("./devtools-formatter");
const useOriginalText = false, useSourceText = true;
function test() {
    const scope = {};
    utils_1.trace('[Scope]', scope);
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
    ]; // .map((source: any) => (source[1] = source[1] && reindent(source[1]) || '', source) || source)
    const sourceFiles = scope.sourceFiles =
        sources.map(([fileName, sourceText, languageVersion = typescript_utils_1.ScriptTarget.Latest]) => Object.assign(typescript_utils_1.ts.createSourceFile(fileName, sourceText, languageVersion), { sourceText, languageVersion }));
    // const transformer = scope.transformer = JSXTransformer.transformer;
    const testTransformer = scope.testTransformer = __1.MockTransformer.transformer;
    const transformationResults = scope.transformationResults =
        sourceFiles.map(sourceFile => {
            const _transformer = sourceFile['scriptKind'] === 4 ? __1.default : testTransformer;
            // debugger;
            const transfrom = utils_1.measure(() => typescript_utils_1.ts.transform(sourceFile, [_transformer]));
            const result = transfrom();
            result.elapsed = transfrom.metrics && transfrom.metrics.elapsed;
            const { transformed: [transformedFile] } = result;
            transformedFile.transformationResult = result;
            result['transformer'] = transformedFile['transformer'] = _transformer;
            // result.dispose();
            // if (sourceFile !== transformedFile) ts.updateSourceFileNode(transformedFile, transformedFile.statements); // debugger;
            return result;
        });
    const transformedFiles = scope.transformedFiles =
        transformationResults.reduce((transformedFiles, transformationResult) => ([...transformedFiles, ...transformationResult.transformed]), []);
    const printer = scope.printer =
        typescript_utils_1.ts.createPrinter();
    const extensionMatcher = /((?:\..*?|)\.tsx?)$/i;
    const save = (input, output, filename, dirname = outputPath) => {
        try {
            const path = path_1.resolve(resolveOutputPath(dirname), filename);
            input && fs_1.writeFileSync(path.replace(extensionMatcher, ' [2]$1'), output || '', { flag: 'w' });
            output && fs_1.writeFileSync(path, input || '', { flag: 'w' });
        }
        catch (exception) {
            error(exception);
        }
    };
    const outputs = scope.outputs =
        transformedFiles.map((transformedFile) => {
            utils_1.trace(`PrintFile[${transformedFile.fileName || typescript_utils_1.SyntaxKind[transformedFile.kind]}]`, { transformedFile });
            const output = useOriginalText && transformedFile.originalText || printer.printFile(transformedFile);
            const { ['original']: sourceFile } = transformedFile;
            const input = sourceFile && ((useSourceText && sourceFile['sourceText']) || (useOriginalText && sourceFile.originalText) || printer.printFile(sourceFile)) || '';
            const { fileName: filename } = sourceFile || transformedFile;
            const escapeText = (string, title, code = highlight.highlightAuto(string.replace(/\\n/g, '\n')), div = document.createElement('div'), fragment = document.createElement('template').content) => [(div.setAttribute('style', 'whitespace: pre'), div.innerHTML = code.value, fragment['type'] = 'highlighted-source-code', fragment['title'] = title, fragment.appendChild(div), fragment)]; // , code new Text(string || '');
            if (inBrowser) {
                group(filename);
                output && log(...escapeText(output, `Output: ${filename}`));
                input && log(...escapeText(input, `Input: ${filename}`));
                groupEnd();
            }
            extensionMatcher.test(filename) && save(input, output, filename);
            if (!sourceFile)
                return output;
            return { input, output };
        });
    log(scope, utils_1.traces); // debugger;
    if (!inBrowser)
        debugger;
}
var outputPath = path_1.resolve(__dirname, '../../test/generated');
var litTemplate = fs_1.readFileSync(require.resolve('../../test/static/lit-clock.tsx'), 'utf-8').toString();
var inBrowser = !(typeof window === 'undefined');
var { log, warn, error, info, group, groupEnd } = console;
test();
function resolveOutputPath(dirname = outputPath) {
    if (dirname !== outputPath)
        dirname = path_1.resolve(__dirname, outputPath);
    if (!fs_1.existsSync(dirname))
        fs_1.mkdirSync(dirname);
    return dirname;
}
//# sourceMappingURL=test-transform.js.map