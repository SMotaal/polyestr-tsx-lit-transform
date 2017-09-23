"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StringFilterArray = Array;
;
class StringFilter extends StringFilterArray {
    constructor(...strings) {
        super(...[].concat(...strings).join(',').split(','));
        for (const string of this)
            this[string] = true;
        this.include = (type) => !!(type && typeof type === 'string' && (this[type]
            || (type = type.trim(), type && this[type])
            || (type = type.toLowerCase(), type && this[type]) // type = (/[a-z]+/i.exec(type) || '')[0], type && this.includes(type.toLowerCase())
        ));
    }
    push(...strings) {
        for (const string of strings)
            this[string] = true;
        return super.push(...strings);
    }
}
exports.StringFilter = StringFilter;
(prototype => prototype.pop = prototype.splice = prototype.reverse = prototype.shift = () => false)(StringFilter.prototype);
exports.ObjectTypes = new StringFilter('object,function');
exports.PrimitiveTypes = new StringFilter('string,boolean,number,symbol');
exports.isPrimitive = (value) => exports.PrimitiveTypes[typeof value];
exports.notPrimitive = (value) => !exports.PrimitiveTypes[typeof value];
exports.isNonPrimitive = (value) => exports.ObjectTypes[typeof value];
exports.notNonPrimitive = (value) => !exports.ObjectTypes[typeof value];
exports.isObjectLike = (value) => value && exports.notPrimitive(value);
// console.log({ ObjectTypes, StrisngFilter });
//# sourceMappingURL=type-guards.js.map