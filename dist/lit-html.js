"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import * as lit from 'lit-html'; // /src/lit-html';
require("./global");
const lit = () => {
    try {
        return require('lit-html');
    }
    catch (exception) {
        const noop = (() => { });
        return { html: noop, svg: noop, render: noop, TemplateResult: class TemplateResult {
            } };
    }
};
exports.html = lit.html;
exports.svg = lit.svg;
exports.render = lit.render;
exports.TemplateResult = lit.TemplateResult;
// export * from 'lit-html';
//# sourceMappingURL=lit-html.js.map