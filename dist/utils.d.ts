export { now } from 'polyestr-utils';
export { isObjectLike } from './type-guards';
export { measure, Metrics } from './performance';
export declare const string: (value: any) => string;
export declare const max: (...values: number[]) => number, min: (...values: number[]) => number;
export declare const indentMatcher: RegExp;
export declare const flattenArrays: (...arrays: any[]) => any;
export declare type Flattner = <T>(...values: (T[][][][] | T[][] | T[] | T)[]) => T[];
export declare const concat: {
    (...items: any[][]): any[];
    (...items: any[]): any[];
};
export declare const flatten: Flattner & {
    arrays: Flattner;
};
export declare const object: (value: any) => value is object;
export declare const filter: (condition: any, node: any) => any;
export declare function Trace(): void;
export declare namespace Trace {
    const trace: any, traces: any;
}
export import trace = Trace.trace;
export import traces = Trace.traces;
