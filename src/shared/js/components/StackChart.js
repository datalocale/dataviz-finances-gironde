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
    Y_AXIS_MARGIN = 60, HEIGHT_PADDING = 40, 
    BRICK_SPACING = 8, MIN_BRICK_HEIGHT = 4,
    legendItems, uniqueColorClass,
    selectedX, yValueDisplay = x => String(x),
    onSelectedXAxisItem, onBrickClicked
}) {
    const columnAndMarginWidth = (WIDTH - Y_AXIS_MARGIN)/(xs.length+1)
    const columnMargin = columnAndMarginWidth/4;
    const columnWidth = columnAndMarginWidth - columnMargin;

    const xScale = scaleLinear()
        .domain([min(xs), max(xs)])
        .range([Y_AXIS_MARGIN+columnAndMarginWidth/2, WIDTH-columnAndMarginWidth/2]);

    const maxAmount = max(ysByX.valueSeq().toJS().map(ys =>  sum(ys))); 

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
                        t: yValueDisplay(tick)
                    }
                    
                }
            })}),
            // content
            React.createElement('g', {className: 'content'},
                ysByX.entrySeq().toJS().map(([x, ys]) => {
                    ys = ys.toJS();

                    const total = sum(ys);

                    const stackYs = ys
                        // .map + .slice is an 0(n²) algorithm. Fine here because n is never higher than 20
                        .map( (amount, i, arr) => sum(arr.slice(0, i)) )
                        .map(yValueScale)
                        .map(height => height < 1 ? 0 : height);

                    const stack = ys
                        .map((y, i) => {
                            const baseHeight = yValueScale(y);

                            const height = baseHeight >= 1 ?
                                Math.max(baseHeight - BRICK_SPACING, MIN_BRICK_HEIGHT) :
                                0;

                            const baseY = HEIGHT - HEIGHT_PADDING - height - BRICK_SPACING/2;

                            return {
                                value: y,
                                height,
                                y: i === 0 ? 
                                    baseY :
                                    baseY - stackYs[i]
                            }
                        });

                    const totalHeight = yValueScale(total);

                    const totalY = HEIGHT - HEIGHT_PADDING - totalHeight;

                    return React.createElement('g', {transform: `translate(${xScale(x)})`, key: x}, 
                        React.createElement('g', {},

                            stack.map( ({value, height, y}, i) => {
                                const colorClass = stack.length === 1 ?
                                    uniqueColorClass :
                                    legendItems && legendItems[i].colorClassName;

                                return React.createElement(
                                    'g', 
                                    {
                                        transform: `translate(0, ${y})`,
                                        className: [
                                            'brick',
                                            onBrickClicked ? 'actionable' : '',
                                            colorClass,
                                        ].join(' '), 
                                        key: i,
                                        onClick: onBrickClicked ? () => {
                                            onBrickClicked(
                                                x, 
                                                legendItems ? legendItems[i].id : y
                                            )
                                        } : undefined
                                    }, 
                                    React.createElement('rect', {x: -columnWidth/2, width: columnWidth, height, rx: 5, ry: 5}),
                                    height >= 30 && stack.length >= 2 ? React.createElement('text', {
                                        transform: `translate(-${columnWidth/2 - 10}, 20)`
                                    }, yValueDisplay(value)) : undefined
                                )
                            })
                        ),
                        React.createElement(
                            'text', 
                            {className: 'title', x: -columnWidth/2, y: totalY, dy: "-1em", dx:"0em", textAnchor: 'right'}, 
                            React.createElement('tspan', {}, yValueDisplay(total))
                        )
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
