import { html, svg } from "../lit-html";
export const template = (minuteTicks, hourTicks) => html(
    <div>
        <style>{`
            :host { display: block; }
            .square { position: relative; width: 100%; height: 0; padding-bottom: 100%; }
            svg { position: absolute; width: 100%; height: 100%; }
            .clock-face { stroke: #333; fill: white; }
            .minor { stroke: #999; stroke-width: 0.5; }
            .major { stroke: #333; stroke-width: 1; }
            .hour { stroke: #333; }
            .minute { stroke: #666; }
            .second, .second-counterweight { stroke: rgb(180,0,0); }
            .second-counterweight { stroke - width: 3; }
        `}</style>
        <div class='square'>
            <svg viewBox='0 0 100 100'>
                <g transform='translate(50,50)'>
                    <circle class='clock-face' r='48' />
                    {minuteTicks}
                    {hourTicks}
                    <line class='hour' y1='2' y2='-20' transform={`rotate(${30 * this.date.getHours() + this.date.getMinutes() / 2})`} />
                    <line class='minute' y1='4' y2='-30' transform={`rotate(${6 * this.date.getMinutes() + this.date.getSeconds() / 10})`} />
                    <g transform={`rotate(${6 * this.date.getSeconds()})`}>
                        <line class='second' y1='10' y2='-38' />
                        <line class='second-counterweight' y1='10' y2='2' />
                    </g>
                </g>
            </svg>
        </div>
    </div>
);
