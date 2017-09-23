
            import { html, svg } from "../lit-html";
            export const template = ({id = '<id>', text = '<text>'}) => html(<p hidden id={id}><awesome-icon icon='awesome'/>{text}</p>);
        