#!/usr/bin/env node

const entry = './test/index';
const { argv } = process;

if (argv.indexOf('--ci') > -1) {
    require('./test/ci');
} else {
    const tryThis = (ƒ, catcher) => { try { return ƒ(); } catch (exception) { return typeof catcher === 'function' ? catcher(exception) : typeof catcher === 'object' ? (catcher.exception = exception) : catcher; }; };
    const runtime = tryThis(() => require.resolve('iron-node/bin/run'), null);
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
