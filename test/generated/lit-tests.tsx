
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
        