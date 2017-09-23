import * as lit from 'lit-html';
import './global';
export declare type JSXFactory<T = lit.TemplateResult> = {
    (...elements): T;
    (strings: TemplateStringsArray, ...values: any[]): T;
};
export declare const html: JSXFactory<lit.TemplateResult>;
export declare const svg: JSXFactory<lit.TemplateResult>;
export * from 'lit-html';
