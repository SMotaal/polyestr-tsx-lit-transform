import { ts } from './typescript-utils';
import CustomTransformer, { TransformationContext, Filter } from './custom-transformer';
export { Node, TransformationContext as Context, SourceFile, TransformationResult as Result } from './custom-transformer';
export declare class MockTransformer<context extends TransformationContext = TransformationContext> extends CustomTransformer {
    context: context;
    static filter: Filter;
    static transformer: <T extends CustomTransformer.Node = CustomTransformer.SourceFile>(context: CustomTransformer.TransformationContext, filter?: CustomTransformer.Filter<CustomTransformer.Node>) => ts.Transformer<T>;
    constructor(context: context);
}
export { _transform as transform, _filter as filter };
export default MockTransformer;
