import { scaleLinear } from 'd3-scale';
import { min, max, sum } from 'd3-array';

import React from 'react';

import LegendList from './LegendList';
import D3Axis from './D3Axis';

/*
    This component displays a stackchart and a legend if there is a legend.
    Colors are attributed by this component via the use of `area-color-${i+1}` classes
    
    It is the caller's responsibility to make sure ys (from ysByX) are sorted in a order 
    that is consistent with the legendItems order
*/
export default function ({ xs, ysByX, 
    WIDTH = 1000, HEIGHT = 430, 
    Y_AXIS_MARGIN = 60, HEIGHT_PADDING = 70, 
    BRICK_PADDING = 3, MIN_BRICK_HEIGHT = 4,
    legendItems,
    selectedX,
    onSelectedXAxisItem
}) {
    console.log('StackChart', xs, ysByX.toJS())

    const columnAndMarginWidth = (WIDTH - Y_AXIS_MARGIN)/(xs.length+1)
    const columnMargin = columnAndMarginWidth/4;
    const columnWidth = columnAndMarginWidth - columnMargin;

    const xScale = scaleLinear()
        .domain([min(xs), max(xs)])
        .range([Y_AXIS_MARGIN+columnAndMarginWidth/2, WIDTH-columnAndMarginWidth/2]);

    const maxAmount = max(ysByX.valueSeq().toJS().map(ys =>  sum(ys.map(y => y.value))))

    const yScale = scaleLinear()
        .domain([0, maxAmount])
        .range([HEIGHT - HEIGHT_PADDING, HEIGHT_PADDING]);

    const [yMin, yMax] = yScale.range();

    const yValueScale = scaleLinear()
        .domain([0, maxAmount])
        .range([0, yMin-yMax]);

    const ticks = yScale.ticks(5);

    return React.createElement('div', { className: 'stackchart' },
        React.createElement('svg', {className: 'over-time', width: WIDTH, height: HEIGHT},
            // x axis
            React.createElement(D3Axis, {
                className: 'x', 
                tickData: xs.map(x => {
                    return {
                        transform: `translate(${xScale(x)}, ${HEIGHT-HEIGHT_PADDING})`,
                        line: { x1 : 0, y1 : 0, x2 : 0, y2 : 0 }, 
                        text: {
                            x: 0, y: -10, 
                            dy: "2em", 
                            t: x
                        },
                        id: x,
                        className: x === selectedX ? 'selected' : undefined
                    }
                }),
                onSelectedAxisItem: onSelectedXAxisItem
            }),
            // y axis
            React.createElement(D3Axis, {className: 'y', tickData: ticks.map(tick => {
                return {
                    transform: `translate(0, ${yScale(tick)})`,
                    line: {
                        x1 : 0, y1 : 0, 
                        x2 : WIDTH, y2 : 0
                    }, 
                    text: {
                        x: 0, y: -10, 
                        anchor: 'right',
                        t: (tick/1000000)+'M'
                    }
                    
                }
            })}),
            // content
            React.createElement('g', {className: 'content'},
                ysByX.entrySeq().toJS().map(([x, ys]) => {
                    const total = sum(ys.toJS().map(y => y.value));

                    const stackYs = ys
                        .map(y => y.value)
                        // .map + .slice is an 0(n²) algorithm. Fine here because n is never higher than 20
                        .map( (amount, i, arr) => sum(arr.toJS().slice(0, i)) )
                        .map(yValueScale);

                    const stack = ys
                        .map((y, i) => {
                            const { value } = y;
                            console.log('y', x, i, y, yValueScale(value));

                            const height = Math.max(yValueScale(value) - BRICK_PADDING, MIN_BRICK_HEIGHT);

                            return {
                                value,
                                height,
                                y: i === 0 ? 
                                    HEIGHT - HEIGHT_PADDING - height :
                                    HEIGHT - HEIGHT_PADDING - height - stackYs.get(i)
                            }
                        });

                    const totalHeight = yValueScale(total);
                    const totalY = HEIGHT - HEIGHT_PADDING - totalHeight;


                    return React.createElement('g', {transform: `translate(${xScale(x)})`}, 
                        React.createElement('g', {},
                            stack.map( ({value, height, y}, i) => {
                                return React.createElement('g', {className: [`area-color-${i+1}`].join(' ')}, 
                                    React.createElement('rect', {x: -columnWidth/2, y, width: columnWidth, height, rx: 5, ry: 5})
                                )
                            })
                        ),
                        React.createElement('text', {x: -columnWidth/2, y: totalY, dy: "-1em", dx:"0em", textAnchor: 'right'}, (total/1000000).toFixed(1)+'M€')
                    )
                })
            )
        ),
        legendItems ? React.createElement(LegendList, {
            items: legendItems.map((li, i) => (Object.assign(
                {colorClassName: `area-color-${i+1}`}, 
                li
            ))).reverse() // to have a order consistent with the stacks
        }) : undefined
    )
}
