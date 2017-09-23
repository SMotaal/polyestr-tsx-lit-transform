declare global  {
    interface Metrics {
        [name: string]: any;
        elapsed: number;
        total: number;
        calls: number;
    }
}
export { Metrics };
export declare const measure: {
    <T, U extends object, Q = ((...args: T[]) => U & {
        metrics: Metrics;
    }) & {
        metrics: Metrics;
    }>(operation: (...args: T[]) => U, metrics: "result"): Q;
    <T, U, P extends (...args: T[]) => U, Q extends P = P & {
        metrics: Metrics;
    }>(operation: P, metrics?: Metrics): Q;
};
export {};
