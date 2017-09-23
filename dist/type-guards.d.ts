export interface StringMap {
    [name: string]: boolean | any;
}
export interface StringFilterPrototype extends Array<string> {
    include: (type?: string) => boolean;
}
export declare type StringFilterConstructor = (new (...strings: string[]) => StringFilterPrototype & Partial<StringMap & {
    [K in (keyof StringMap & keyof StringFilterPrototype)]: StringFilterPrototype[K];
}>);
declare const StringFilter_base: new (...strings: string[]) => StringFilterPrototype & Partial<StringMap & {}>;
export declare class StringFilter extends StringFilter_base {
    include: (type?: string) => boolean;
    constructor(strings: string);
    constructor(strings: string[]);
    constructor(...strings: string[]);
    push(...strings: string[]): number;
}
export declare const ObjectTypes: StringFilter;
export declare const PrimitiveTypes: StringFilter;
export declare const isPrimitive: (value: any) => value is object;
export declare const notPrimitive: (value: any) => value is object;
export declare const isNonPrimitive: (value: any) => value is object;
export declare const notNonPrimitive: (value: any) => value is object;
export declare const isObjectLike: (value: any) => value is object;
