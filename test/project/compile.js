#!/usr/bin/env node --

const { inspect } = require('util');
const ciFlag = process.argv.indexOf('--ci') > -1;

compile();

function compile() {
    const ts = require('typescript');

    const [srcPath, configPath] = ['./src/index.tsx', './tsconfig.json'].map(require.resolve);
    const dstPath = srcPath.slice(0, -1);

    const config = require(configPath);
    const { compilerOptions } = config;

    console.log(`*** COMPILE.JS ***`)
    log('FILES', { src: srcPath, dst: dstPath, cfg: configPath }, null);

    const transformResult = transform(srcPath, dstPath);

    log('TRANSFORM', transformResult, 1);

    const tscPath = require.resolve('typescript/lib/tsc');

    log('COMPILE', `using ${tscPath}`);
    require('typescript/lib/tsc');
}

function transform(src, dst) {
    const { transform, writeFile } = require('polyestr-tsx-lit-transform');
    const result = transform(src);
    console.log(`Writing: ${dst}`);
    writeFile(result, dst);
    return result;
}

function log(header, body = '', depth = null, force = false) {
    const brief = ciFlag && !force;
    if (!body || typeof body === 'string') return console.log(`\n${header}${body && ': ' + body || ''}\n`);
    body = body && inspect(body, false, brief ? 1 : depth, true).split('\n').join('\t\n')
        .replace(/^(\s*)[\{\[]/, '$1 ')
        .replace(/[\}\]](\s*)$/, '$1');
    if (header) body = `  ${body.split('\n').join('\n  ')}`;
    body.trim() && console.log(`\n${header && header + ':\n' || ''}${body}\n`);
}
