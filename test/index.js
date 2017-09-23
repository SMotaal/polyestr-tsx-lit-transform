#!/usr/bin/env node -r ts-node/register
// console.clear();

const tryThis = (ƒ, fallback) => { try { return ƒ(); } catch (exception) { return typeof fallback === 'function' ? fallback(exception) : typeof fallback === 'object' ? (fallback.exception = exception) : fallback; }; };

const main = [
    '../dist/test/test-transform',
    '../src/test/test-transform.ts'
].find(path => tryThis(() => require.resolve(path)));

if (!main)
    throw Error(`Cannot find module's main file.`);

const canUsePolyestrModules = tryThis(() => !!require.resolve('polyestr-utils/lib/bootstrap-banner'), false);
const shouldUseTSNode = /.tsx?$/.test(main) || true;

if (canUsePolyestrModules) {
    const banner = require('polyestr-utils/lib/bootstrap-banner')(require(`../package.json`));
    shouldUseTSNode && require('polyestr-utils/lib/bootstrap-ts-node');
} else if (shouldUseTSNode) {
    throw Error(`Cannot run modules tests on the package without building it first.\n\tTry running "yarn build" in "${__dirname.replace(/.test.?$/)}".`);
}
require(main);
