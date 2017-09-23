
            import { html, svg } from "../lit-html";
            export const html = (strings: TemplateStringsArray, ... values) => ({strings, values});
            export const template = ({id = '<id>', text = '<text>'}) => html(
                html(<h1 hidden id={id}><awesome-icon icon='awesome'/>{text}</h1>),
                html(<div>
                    { ... ['a', 'b', 'c'].map(text => html(<p>{text}</p>)) }
                </div>)
            );
        