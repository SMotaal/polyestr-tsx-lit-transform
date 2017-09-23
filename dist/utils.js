"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var polyestr_utils_1 = require("polyestr-utils");
exports.now = polyestr_utils_1.now;
var type_guards_1 = require("./type-guards");
exports.isObjectLike = type_guards_1.isObjectLike;
var performance_1 = require("./performance");
exports.measure = performance_1.measure;
exports.string = (value) => (typeof value === 'string' && value || ''); // : gate<string, ''>
exports.max = Math.max, exports.min = Math.min;
exports.indentMatcher = (/^\n?[ ]+/);
exports.flattenArrays = (...arrays) => [].concat(...arrays.map(item => item && item.constructor === Array ? exports.flattenArrays(...item) : item));
exports.concat = Array.prototype.concat;
exports.flatten = Object.defineProperties((...arrays) => [].concat(...arrays.map(item => item
    && (item[Symbol.isConcatSpreadable] === true
        || item.constructor === Array
        || item.concat === exports.concat) ? exports.flatten(...item) : item)), Object.getOwnPropertyDescriptors({
    arrays: exports.flattenArrays,
}));
// export const reindent = (string: string, replace = (indentMatcher.exec(string) || '')[0]) => replace && string && typeof string === 'string' && string.replace(new RegExp(replace, 'g'), '\n');
// export const indent = (string: string) =>
//     typeof string === 'string' ? max(0, 0 || (indentMatcher.exec(string || '') as string[])[0].length - 1) : 0;
// export const reindent =
//     (string: string, offset: number = -indent(string)) =>
//         offset < 0 ? string.split(`\n${' '.repeat(-offset)} `).join('\n')
//             : offset > 0 ? string.split('\n').join(`\n${' '.repeat(offset)}`)
//                 : string;
exports.object = (value) => typeof value === 'object';
exports.filter = (condition, node) => condition && node || false;
// export const { now } = Date;
function Trace() {
    const Traces = (Trace['Trace'] || (Trace['Trace'] = class Trace {
    }));
    const traces = new Traces();
    let traceIndex = 0;
    const trace = (header, ...contents) => traces[`${header && header[0] === '[' ? '*' : '- ' + ('' + ++traceIndex).padStart(4, '0000')} ${header}`.trim()] = contents.length === 1 ? contents[0] : contents;
    trace['trace'] = trace, trace['traces'] = traces;
    return trace;
}
exports.Trace = Trace;
(function (Trace) {
    _a = new Trace(), Trace.trace = _a.trace, Trace.traces = _a.traces;
    var _a;
})(Trace = exports.Trace || (exports.Trace = {}));
exports.trace = Trace.trace;
exports.traces = Trace.traces;
//# sourceMappingURL=utils.js.map