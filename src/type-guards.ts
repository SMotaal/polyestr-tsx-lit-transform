export interface StringMap { [name: string]: boolean | any; }
const StringFilterArray = Array as any as StringFilterConstructor;
export interface StringFilterPrototype extends Array<string> { include: (type?: string) => boolean; };
export type StringFilterConstructor = (new (...strings: string[]) => StringFilterPrototype & Partial<StringMap & {[K in (keyof StringMap & keyof StringFilterPrototype)]: StringFilterPrototype[K]; }>);

export class StringFilter extends (StringFilterArray as StringFilterConstructor) {
    include: (type?: string) => boolean;

    constructor(strings: string);
    constructor(strings: string[]);
    constructor(...strings: string[]);
    constructor(...strings) {
        super(...[].concat(...strings).join(',').split(','));
        for (const string of this) this[string] = true;
        this.include = (type) => !!(
            type && typeof type === 'string' && (
                this[type]
                || (type = type.trim(), type && this[type])
                || (type = type.toLowerCase(), type && this[type]) // type = (/[a-z]+/i.exec(type) || '')[0], type && this.includes(type.toLowerCase())
            ));
    }

    push(...strings: string[]) {
        for (const string of strings) this[string] = true;
        return super.push(...strings);
    }

} (prototype =>
    prototype.pop = prototype.splice = prototype.reverse = prototype.shift = () => false as any
)(StringFilter.prototype);

export const ObjectTypes = new StringFilter('object,function');
export const PrimitiveTypes = new StringFilter('string,boolean,number,symbol');

export const isPrimitive = (value): value is object => PrimitiveTypes[typeof value];
export const notPrimitive = (value): value is object => !PrimitiveTypes[typeof value];
export const isNonPrimitive = (value): value is object | null => ObjectTypes[typeof value];
export const notNonPrimitive = (value): value is object => !ObjectTypes[typeof value];
export const isObjectLike = (value): value is object => value && notPrimitive(value);

// console.log({ ObjectTypes, StrisngFilter });
