#!/usr/bin/env node -r ts-node/register --

const entries = [
    '../dist/test/test-transform',
    '../src/test/test-transform.ts'
];
const bootstrapper = 'polyestr-utils/lib/bootstrap-banner', definition = '../package.json';
const tryThis = (ƒ, fallback) => { try { return ƒ(); } catch (exception) { return typeof fallback === 'function' ? fallback(exception) : typeof fallback === 'object' ? (fallback.exception = exception) : fallback; }; };
const canUsePolyestrModules = tryThis(() => !!require.resolve(bootstrapper), false);

if (canUsePolyestrModules) {
    const banner = require(bootstrapper)(require(definition));
    main();
    console.info('\n  √ Everything looks good.\n')
} else {
    throw Error(`Cannot run modules tests on the package without building it first.\n\tTry running "yarn build" in "${__dirname.replace(/.test.?$/)}".`);
}

function main(entry = entries.find(path => tryThis(() => require.resolve(path)))) {
    if (!entry) throw Error(`Cannot find module's main file.`);
    if (/.tsx?$/.test(entry) || true) require('polyestr-utils/lib/bootstrap-ts-node');
    require(entry);
}
