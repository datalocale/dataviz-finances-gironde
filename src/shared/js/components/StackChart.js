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
export default function ({ 
    // data
    xs, ysByX, 
    // aestetics
    portrait = false,
    WIDTH = 800, HEIGHT = 430, 
    Y_AXIS_MARGIN = 80, HEIGHT_PADDING = 40, 
    BRICK_SPACING = 6, MIN_BRICK_HEIGHT = 4,
    PORTRAIT_COLUMN_WIDTH = 70,
    // legend
    legendItems, uniqueColorClass,
    // other
    selectedX, yValueDisplay = x => String(x),
    // events
    onSelectedXAxisItem, onBrickClicked
}) {
    const columnAndMarginWidth = (WIDTH - Y_AXIS_MARGIN)/(xs.length)
    const columnMargin = columnAndMarginWidth/4;
    const columnWidth = columnAndMarginWidth - columnMargin;

    const xScale = scaleLinear()
        .domain([min(xs), max(xs)])
        .range(portrait ?
            [HEIGHT_PADDING, HEIGHT - PORTRAIT_COLUMN_WIDTH]:
            [Y_AXIS_MARGIN+columnAndMarginWidth/2, WIDTH-columnAndMarginWidth/2]
        );

    const maxAmount = max(ysByX.valueSeq().toJS().map(ys =>  sum(ys))); 

    const yScale = scaleLinear()
        .domain([0, maxAmount])
        .range(
            portrait ?
                [0, WIDTH - 5]:
                [HEIGHT - HEIGHT_PADDING, HEIGHT_PADDING]
        );

    const [yMin, yMax] = yScale.range();

    const yValueScale = scaleLinear()
        .domain([0, maxAmount])
        .range([0, Math.abs(yMin-yMax)]);

    const ticks = yScale.ticks(5);

    return React.createElement('div', { 
        className: ['stackchart', portrait ? 'portrait' : ''].filter(e => e).join(' ') 
    },
        // useless <div> to defend the <svg> in Chrome when using flex: 1 on the legend
        React.createElement('div', {className: 'over-time'},
            React.createElement('svg', {width: WIDTH, height: HEIGHT},
                // x axis
                React.createElement(D3Axis, {
                    className: 'x', 
                    tickData: xs.map(x => {
                        return {
                            transform: portrait ?
                                `translate(0, ${xScale(x)})` :
                                `translate(${xScale(x)}, ${HEIGHT-HEIGHT_PADDING})`,
                            line: { x1 : 0, y1 : 0, x2 : 0, y2 : 0 }, 
                            text: {
                                x: portrait ? 0 : -10, 
                                y: 0, 
                                dx: portrait ? '1em' : undefined, 
                                dy: portrait ? undefined : '2em', 
                                anchor: portrait ? 'left' : undefined,
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
                        transform: portrait ?
                            `translate(${yScale(tick)}, 0)` :    
                            `translate(0, ${yScale(tick)})`,
                        line: {
                            x1 : 0, 
                            y1 : 0, 
                            x2 : portrait ? 0 : WIDTH,
                            y2 : portrait ? HEIGHT : 0
                        }, 
                        text: {
                            x: 0, 
                            y: portrait ? 0 : -10, 
                            dx: portrait ? 5 : 0, 
                            dy: portrait ? 12 : 0, 
                            anchor: portrait ? 'left' : 'right',
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

                                const baseY = portrait ?
                                    +BRICK_SPACING/2 :
                                    HEIGHT - HEIGHT_PADDING - height - BRICK_SPACING/2;

                                return {
                                    value: y,
                                    height,
                                    y: i === 0 ? 
                                        baseY :
                                        (portrait ? 
                                            baseY + stackYs[i] :
                                            baseY - stackYs[i])
                                }
                            });


                        const totalHeight = yValueScale(total);

                        const totalY = HEIGHT - HEIGHT_PADDING - totalHeight;

                        return React.createElement('g', 
                            {
                                transform: portrait ? `translate(0, ${xScale(x) + 6 })` : `translate(${xScale(x)})`, 
                                key: x                    
                            }, 
                            React.createElement('g', {},

                                stack.map( ({value, height, y}, i) => {
                                    const colorClass = stack.length === 1 ?
                                        uniqueColorClass :
                                        legendItems && legendItems[i].colorClassName;

                                    return React.createElement(
                                        'g', 
                                        {
                                            transform: portrait ? `translate(${y})` : `translate(0, ${y})`,
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
                                        React.createElement('rect', {
                                            x: portrait ? 0 : -columnWidth/2,
                                            y: 0,
                                            width: portrait ? height : columnWidth, 
                                            height: portrait ? PORTRAIT_COLUMN_WIDTH - 12 : height, 
                                            rx: 5, 
                                            ry: 5
                                        }),
                                        (stack.length >= 2 && (
                                            (!portrait && height >= 30) ||
                                            (portrait && height >= 60)
                                        )) ? React.createElement('text', {
                                            transform: portrait ?
                                                `translate(2, 20)`:
                                                `translate(-${columnWidth/2 - 10}, 20)`
                                        }, yValueDisplay(value)) : undefined
                                    )
                                })
                            ),
                            React.createElement(
                                'text', 
                                {
                                    className: 'stackchart-title', 
                                    x: portrait ? WIDTH - 90 : -columnWidth/2, 
                                    y: portrait ? 0 : totalY, 
                                    dy: portrait ? '-6' : '-1em', 
                                    dx: '0em', 
                                    textAnchor: 'right'
                                }, 
                                React.createElement('tspan', {}, yValueDisplay(total))
                            )
                        )
                    })
                )
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
