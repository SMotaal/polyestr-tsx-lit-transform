#!/usr/bin/env node --

const entry = '../dist/test/test-transform';
const bootstrapper = 'polyestr-utils/lib/bootstrap-banner', definition = '../package.json';
const tryThis = (ƒ, fallback) => { try { return ƒ(); } catch (exception) { return typeof fallback === 'function' ? fallback(exception) : typeof fallback === 'object' ? (fallback.exception = exception) : fallback; }; };
const canUsePolyestrModules = tryThis(() => !!require.resolve(bootstrapper), false);

if (canUsePolyestrModules) {
    const banner = require(bootstrapper)(require(definition));
    entry && require(entry);
    console.info('\n  √ Everything looks good.\n')
} else {
    throw Error(`Cannot run modules tests on the package without building it first.\n\tTry running "yarn build" in "${__dirname.replace(/.test.?$/)}".`);
}
