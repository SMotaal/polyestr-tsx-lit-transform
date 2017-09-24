/**
 * Adapted from the Ractive.js clock example: http://www.ractivejs.org/examples/clock/
 */
export declare class LitClock extends HTMLElement {
    private _date;
    needsRender: boolean;
    shadowRoot: ShadowRoot;
    date: any;
    constructor();
    render(): any;
    invalidate(): void;
}
