import { now } from 'polyestr-utils';
import { isObjectLike } from './type-guards';

declare global { interface Metrics { [name: string]: any; elapsed: number; total: number; calls: number; } }
export { Metrics };

const metricsKeys = ['elapsed', 'total', 'calls'];
export const measure = (<T, U, P extends (...args: T[]) => U, Q extends P = P & { metrics: Metrics }>(operation: P, metrics: Metrics = {} as Metrics): Q => {
    let start, end, result: U;
    const appendToResults = metrics as any === 'result';
    metrics = operation['metrics'] = isObjectLike(metrics) ? metrics : isObjectLike(operation['metrics']) ? operation['metrics'] : {} as Metrics;
    for (const metric of metricsKeys) isNaN(metrics[metric]) && (metrics[metric] = 0);
    return Object.setPrototypeOf((...args: T[]) => (
        metrics.calls++ , start = now(),
        result = operation(...args),
        end = now(), metrics.total += metrics.elapsed = end - start,
        appendToResults && isObjectLike(result) && (result['metrics'] = metrics),
        result
    ), operation) as Q;
}) as {
        <T, U extends object, Q = ((...args: T[]) => (U & { metrics: Metrics })) & { metrics: Metrics }>(operation: (...args: T[]) => U, metrics: 'result'): Q;
        <T, U, P extends (...args: T[]) => U, Q extends P = P & { metrics: Metrics }>(operation: P, metrics?: Metrics): Q;
    };

