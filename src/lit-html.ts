// import * as lit from 'lit-html'; // /src/lit-html';
import './global';

const lit: any = () => {
    try {
        return require('lit-html') as any;
    } catch (exception) {
        const noop = (() => { }) as any;
        return { html: noop, svg: noop, render: noop, TemplateResult: class TemplateResult { } };
    }
}

export type JSXFactory<T = any> = {
    (...elements): T;
    (strings: TemplateStringsArray, ...values: any[]): T;
};

export const html = lit.html as JSXFactory;
export const svg = lit.svg as JSXFactory;
export const render = lit.render;
export const TemplateResult = lit.TemplateResult;

// export * from 'lit-html';
