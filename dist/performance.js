"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const polyestr_utils_1 = require("polyestr-utils");
const type_guards_1 = require("./type-guards");
const metricsKeys = ['elapsed', 'total', 'calls'];
exports.measure = ((operation, metrics = {}) => {
    let start, end, result;
    const appendToResults = metrics === 'result';
    metrics = operation['metrics'] = type_guards_1.isObjectLike(metrics) ? metrics : type_guards_1.isObjectLike(operation['metrics']) ? operation['metrics'] : {};
    for (const metric of metricsKeys)
        isNaN(metrics[metric]) && (metrics[metric] = 0);
    return Object.setPrototypeOf((...args) => (metrics.calls++, start = polyestr_utils_1.now(),
        result = operation(...args),
        end = polyestr_utils_1.now(), metrics.total += metrics.elapsed = end - start,
        appendToResults && type_guards_1.isObjectLike(result) && (result['metrics'] = metrics),
        result), operation);
});
//# sourceMappingURL=performance.js.map