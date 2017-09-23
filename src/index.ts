console.info(`Entry: polyestr-tsx-lit-transform/index`);
export { JSXTransformer, transform as transformer, transform as default } from './jsx-transformer'; // default,
export { MockTransformer } from './mock-transformer';
export { Node, TransformationContext, TransformationContext as Context, SourceFile, TransformationResult as Result } from './custom-transformer';
export { transform, readFile, writeFile } from './transform-utils';
