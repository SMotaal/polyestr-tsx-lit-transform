import { now, assign as assignTo } from 'polyestr-utils';
export { now } from 'polyestr-utils';
export { isObjectLike } from './type-guards';
export { measure, Metrics } from './performance';

export const string = (value) => (typeof value === 'string' && value || ''); // : gate<string, ''>

export const { max, min } = Math;

export const indentMatcher = (/^\n?[ ]+/);

export const flattenArrays = (...arrays) =>
    [].concat(...arrays.map(item => item && item.constructor === Array ? flattenArrays(...item) : item));

export type Flattner = <T>(...values: (T[][][][] | T[][] | T[] | T)[]) => T[];

export const { concat } = Array.prototype;
export const flatten = Object.defineProperties(
    (...arrays) =>
        [].concat(
            ...arrays.map(
                item => item
                    && (
                        item[Symbol.isConcatSpreadable] === true
                        || item.constructor === Array
                        || item.concat === concat
                    ) ? flatten(...item) : item)
        ),
    Object.getOwnPropertyDescriptors({
        arrays: flattenArrays,
    })
) as Flattner & { arrays: Flattner };

// export const reindent = (string: string, replace = (indentMatcher.exec(string) || '')[0]) => replace && string && typeof string === 'string' && string.replace(new RegExp(replace, 'g'), '\n');

// export const indent = (string: string) =>
//     typeof string === 'string' ? max(0, 0 || (indentMatcher.exec(string || '') as string[])[0].length - 1) : 0;

// export const reindent =
//     (string: string, offset: number = -indent(string)) =>
//         offset < 0 ? string.split(`\n${' '.repeat(-offset)} `).join('\n')
//             : offset > 0 ? string.split('\n').join(`\n${' '.repeat(offset)}`)
//                 : string;

export const object = (value): value is object => typeof value === 'object' as typeof value;
export const filter = (condition, node) => condition && node || false;
// export const { now } = Date;

export function Trace(): void {
    const Traces = (Trace['Trace'] || (Trace['Trace'] = class Trace { }));
    const traces: any = new Traces(); let traceIndex = 0;
    const trace = (header, ...contents) => traces[`${header && header[0] === '[' ? '*' : '- ' + ('' + ++traceIndex).padStart(4, '0000')} ${header}`.trim()] = contents.length === 1 ? contents[0] : contents;
    trace['trace'] = trace, trace['traces'] = traces;
    return trace as any;
}

export namespace Trace {
    export const { trace, traces } = new Trace();
}

export import trace = Trace.trace;
export import traces = Trace.traces;


