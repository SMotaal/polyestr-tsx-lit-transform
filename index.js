#!/usr/bin/env node --

const entry = './dist/index';

if (require.main === module) {
    require('./debug');
} else {
    try {
        module.exports = entry ? require(entry) : {};
    } catch (exception) {
        try {
            if (!require('fs').existsSync(require('path').resolve(__dirname, entry)))
                exception = `Cannot load module since it has not been built:\n\n\t${exception.message}\n\n\tTry running "yarn build" in "${__dirname}" to compile the missing "${entry}" for this module.`;
        } catch (runtimeException) {
            runtimeException.message = `Cannot load module since due to a potentially unsupported runtime environment:\n\n\t${runtimeException.message}\n\n\tMake sure you are using a compatible node environment.`;
            exception = runtimeException;
        }
        if (exception) throw exception;
    }
}
