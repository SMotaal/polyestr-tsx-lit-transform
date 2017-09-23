"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.info(`Entry: polyestr-tsx-lit-transform/index`);
var jsx_transformer_1 = require("./jsx-transformer"); // default,
exports.JSXTransformer = jsx_transformer_1.JSXTransformer;
exports.transformer = jsx_transformer_1.transform;
exports.default = jsx_transformer_1.transform;
var mock_transformer_1 = require("./mock-transformer");
exports.MockTransformer = mock_transformer_1.MockTransformer;
var transform_utils_1 = require("./transform-utils");
exports.transform = transform_utils_1.transform;
exports.readFile = transform_utils_1.readFile;
exports.writeFile = transform_utils_1.writeFile;
//# sourceMappingURL=index.js.map