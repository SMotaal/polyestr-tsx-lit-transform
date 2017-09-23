import { html, svg } from "../lit-html";
export const template = ({ id = "<id>", name, text = "<text>" }) => html `<div>${[
    html `<p id=${id}>${html `<b>${name}</b>`}: ${text}</p>`,
    html `<p id=${id}><b>${name}</b>: ${text}</p>`,
]}</div>`;
