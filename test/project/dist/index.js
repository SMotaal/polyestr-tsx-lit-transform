"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const lit_html_1 = require("./lit-html");
/**
 * Adapted from the Ractive.js clock example: http://www.ractivejs.org/examples/clock/
 */
class LitClock extends HTMLElement {
    get date() { return this._date; }
    set date(v) { this._date = v; this.invalidate(); }
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        setInterval(() => this.date = new Date(), 1000);
    }
    render() {
        return this.needsRender = false, lit_html_1.html `<div><style>${`\n                    :host { display: block; }\n                    .square { position: relative; width: 100%; height: 0; padding-bottom: 100%; }\n                    svg { position: absolute; width: 100%; height: 100%; }\n                    .clock-face { stroke: #333; fill: white; }\n                    .minor { stroke: #999; stroke-width: 0.5; }\n                    .major { stroke: #333; stroke-width: 1; }\n                    .hour { stroke: #333; }\n                    .minute { stroke: #666; }\n                    .second, .second-counterweight { stroke: rgb(180,0,0); }\n                    .second-counterweight { stroke - width: 3; }\n                `}</style><div class="square"><svg viewBox="0 0 100 100"><g transform="translate(50,50)"><circle class="clock-face" r="48"/>${minuteTicks}${hourTicks}<line class="hour" y1="2" y2="-20" transform=${`rotate(${30 * this.date.getHours() + this.date.getMinutes() / 2})`}/><line class="minute" y1="4" y2="-30" transform=${`rotate(${6 * this.date.getMinutes() + this.date.getSeconds() / 10})`}/><g transform=${`rotate(${6 * this.date.getSeconds()})`}><line class="second" y1="10" y2="-38"/><line class="second-counterweight" y1="10" y2="2"/></g></g></svg></div></div>`;
    }
    invalidate() {
        if (!this.needsRender) {
            this.needsRender = true;
            Promise.resolve().then(() => lit_html_1.render(this.render(), this.shadowRoot));
        }
    }
}
exports.LitClock = LitClock;
customElements.define("lit-clock", LitClock);
const minuteTicks = (() => {
    const lines = [];
    for (let i = 0; i < 60; i++)
        lines.push(lit_html_1.svg `<line class="minor" y1="42" y2="45" transform=${`rotate(${360 * i / 60})`}/>`);
    return lines;
})();
const hourTicks = (() => {
    const lines = [];
    for (let i = 0; i < 12; i++)
        lines.push(lit_html_1.svg `<line class="major" y1="32" y2="45" transform=${`rotate(${360 * i / 12})`}/>`);
    return lines;
})();
//# sourceMappingURL=index.js.map