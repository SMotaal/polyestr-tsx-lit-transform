#!/usr/bin / env node --

const entry = './test/index';
const bootstrapper = 'iron-node/bin/run';
const tryThis = (ƒ, fallback) => { try { return ƒ(); } catch (exception) { return typeof fallback === 'function' ? fallback(exception) : typeof fallback === 'object' ? (fallback.exception = exception) : fallback; }; };
const { argv } = process;

if (argv.indexOf('--ci') > -1) {
    require('./test/ci');
} else if (entry) {
    const runtime = tryThis(() => bootstrapper && require.resolve(bootstrapper), null);
    const canBootstrap = runtime && !(require.cache[require] && require.cache[require].loaded);

    if (!canBootstrap)
        require(entry);
    else
        argv[argv.indexOf(require.main.filename)] = runtime,
            argv.push(`${entry}.js`),
            require(runtime);

    if (runtime === null)
        console.info(` [FYI] Debugging this project works best with iron-node installed. Try "yarn add iron-node" for a better debugging expereince. `);
}
