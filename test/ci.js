const tryThis = (ƒ, fallback) => { try { return ƒ(); } catch (exception) { return typeof fallback === 'function' ? fallback(exception) : typeof fallback === 'object' ? (fallback.exception = exception) : fallback; }; };
const canUsePolyestrModules = tryThis(() => !!require.resolve('polyestr-utils/lib/bootstrap-banner'), false);

if (canUsePolyestrModules) {
    const banner = require('polyestr-utils/lib/bootstrap-banner')(require(`../package.json`));
    require('../dist/test/test-transform');
} else {

}

if (canUsePolyestrModules) {
    const banner = require('polyestr-utils/lib/bootstrap-banner')(require(`../package.json`));
    require('../dist/test/test-transform');
    console.info('\n  √ Everything looks good.\n')
} else {
    throw Error(`Cannot run modules tests on the package without building it first.\n\tTry running "yarn build" in "${__dirname.replace(/.test.?$/)}".`);
}
