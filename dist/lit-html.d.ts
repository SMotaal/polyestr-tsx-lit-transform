import './global';
export declare type JSXFactory<T = any> = {
    (...elements): T;
    (strings: TemplateStringsArray, ...values: any[]): T;
};
export declare const html: JSXFactory<any>;
export declare const svg: JSXFactory<any>;
export declare const render: any;
export declare const TemplateResult: any;
