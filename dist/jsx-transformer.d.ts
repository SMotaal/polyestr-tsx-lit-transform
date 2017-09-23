import { ts } from './typescript-utils';
import CustomTransformer, { Filter } from './custom-transformer';
export { Node, TransformationContext as Context, SourceFile, TransformationResult as Result } from './custom-transformer';
export declare class JSXTransformer extends CustomTransformer {
    static templateTags: string[];
    static filter: Filter;
    static transformer: <T extends CustomTransformer.Node = CustomTransformer.SourceFile>(context: CustomTransformer.TransformationContext, filter?: CustomTransformer.Filter<CustomTransformer.Node>) => ts.Transformer<T>;
    constructor(context: CustomTransformer['context']);
}
export { _transform as transform, _filter as filter };
export default JSXTransformer;
