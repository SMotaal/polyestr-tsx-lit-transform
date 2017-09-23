import * as lit from 'lit-html'; // /src/lit-html';
import './global';

export type JSXFactory<T = lit.TemplateResult> = {
    (...elements): T;
    (strings: TemplateStringsArray, ...values: any[]): T;
};

export const html = lit.html as JSXFactory;
export const svg = lit.svg as JSXFactory;

export * from 'lit-html';
