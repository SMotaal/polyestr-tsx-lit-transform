declare namespace JSX {
    type Element = any;
    interface IntrinsicElement extends Partial<HTMLElement> { [name: string]: any; }
    type IntrinsicElements = { [name: string]: IntrinsicElement; }
}
