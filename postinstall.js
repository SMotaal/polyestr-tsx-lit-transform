const tryThis = (ƒ, fallback) => { try { return ƒ(); } catch (exception) { return typeof fallback === 'function' ? fallback(exception) : typeof fallback === 'object' ? (fallback.exception = exception) : fallback; }; };

const litLib = tryThis(() => require('lit-html'), false);
const litPackage = litLib || tryThis(() => require('lit-html/package.json'), false);

if (!litLib || !litPackage) {
    let message = `\n\n** POLYESTR-TSX-LIT-TRANSFORM: dependency LIT-HTML is REQUIRED `;

    message += !litPackage ? 'but it is NOT INSTALLED and NOT BUILT automatically.\n' : 'and it IS INSTALLED but NOT BUILT automatically (a known bug).\n\n'

    if (!litPackage)
        message += '\t* TO INSTALL: try running yarn add PolymerLabs/lit-html.\n';

    if (!litLib)
        message += '\t* TO BUILD: if the dist folder inside lit-html is missing try running yarn build inside your local node_modules/lit-html folder.\n'

    message += '\n\n';

    console.warn(message);

}
