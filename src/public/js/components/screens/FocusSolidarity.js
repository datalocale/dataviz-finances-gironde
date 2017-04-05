import React from 'react';
import { connect } from 'react-redux';

import { Record } from 'immutable';
import { scaleLinear } from 'd3-scale';
import { min, max, sum } from 'd3-array';

import budgetBalance from '../../../../shared/js/finance/budgetBalance';
import m52ToAggregated from '../../../../shared/js/finance/m52ToAggregated';
import hierarchicalAggregated from '../../../../shared/js/finance/hierarchicalAggregated';
import {flattenTree} from '../../../../shared/js/finance/visitHierarchical';
import {PAR_PUBLIC_VIEW, PAR_PRESTATION_VIEW} from '../../../../shared/js/finance/constants';



function D3Axis({
    tickData, className
}){
    return React.createElement('g', {className: ['d3-axis', className].filter(x => x).join(' ')}, 
        tickData.map(({transform, line: {x1, y1, x2, y2}, text: {x, y, dx, dy, t} }) => {
            return React.createElement('g', {className: 'tick', transform}, 
                React.createElement('line', {x1, y1, x2, y2}),
                React.createElement('text', {x, y, dx, dy}, t)
            )
        })
    )
}



/*

interface FocusSolidarityProps{
    currentYear,
    solidarityByYear: Map<year, Record<{
        totalExpenditures,
        solidarityExpenditures,
        'DF-1-1',
        'DF-1-2',
        'DF-1-3',
        'DF-1-4',
        'DF-1-other',
    }>[]
}

*/


const WIDTH = 1000;
const HEIGHT = 570;

const HEIGHT_PADDING = 30;

export function FocusSol({
    currentYear, currentYearSolidarity, solidarityByYear
}) {

    const years = solidarityByYear.keySeq().toJS();

    const columnAndMarginWidth = WIDTH/(years.length+1)
    const columnMargin = columnAndMarginWidth/4;
    const columnWidth = columnAndMarginWidth - columnMargin;
    
    const yearScale = scaleLinear()
        .domain([min(years), max(years)])
        .range([columnAndMarginWidth/2, WIDTH-columnAndMarginWidth/2]);

    const solidarityTotals = solidarityByYear.valueSeq().toJS()
        .map(ys => ys.solidarityExpenditures);

    const maxSolidarityTotal = max(solidarityTotals);



    const yAxisAmountScale = scaleLinear()
        .domain([0, maxSolidarityTotal])
        .range([HEIGHT - HEIGHT_PADDING, HEIGHT_PADDING]);
    const yRange = yAxisAmountScale.range()[0] - yAxisAmountScale.range()[1];

    const ticks = yAxisAmountScale.ticks(5);

    const rectAmountScale = scaleLinear()
        .domain([0, maxSolidarityTotal])
        .range([0, yRange]);


    return React.createElement('article', {className: 'focus'},
        React.createElement('section', {}, 
            React.createElement('h1', {}, 'Solidarité'),
            React.createElement('p', {}, 
                `Face à l’augmentation croissante des situations d’exclusion et de précarité, le Département affirme sa vocation sociale et poursuit avec détermination des politiques concertées et innovantes en particulier dans le domaine de l’insertion et l’accompagnement des personnes en difficultés.`,
                React.createElement('strong', {}, `PRECISER L'ANNEE XX%`),
                ` du total des dépenses de fonctionnement du département sont dédiées aux allocations et prestations sociales ou de solidarité.`
            )
        ),
        React.createElement('section', {}, 
            React.createElement('Donut'),
            React.createElement('paragraphs'),
            React.createElement('fraction')
        ),
        React.createElement('section', {}, 
            React.createElement('h2', {}, `Les moyens d'action`),
            React.createElement('p', {}, `bla bla bla`),
            React.createElement('p', {}, `bla bla bla`),
            React.createElement('p', {}, `bla bla bla`)
        ),
        React.createElement('section', {}, 
            React.createElement('h2', {}, `Evolution des dépenses de “Solidarités” par prestation de XXX à YYY`),
            React.createElement('div', {className: 'solidarity-by-year'},
                React.createElement('svg', {width: WIDTH, height: HEIGHT},
                    // x axis / years
                    React.createElement(D3Axis, {className: 'x', tickData: 
                        years.map(y => {
                            return {
                                transform: `translate(${yearScale(y)}, ${HEIGHT-HEIGHT_PADDING})`,
                                line: { x1 : 0, y1 : 0, x2 : 0, y2 : 0 }, 
                                text: {
                                    x: 0, y: -10, 
                                    dx: "-1.6em", dy: "2em", 
                                    t: y
                                }
                                
                            }
                        })
                    }),
                    // y axis / money amounts
                    React.createElement(D3Axis, {className: 'y', tickData: ticks.map(tick => {
                        return {
                            transform: `translate(0, ${yAxisAmountScale(tick)})`,
                            line: {
                                x1 : 0, y1 : 0, 
                                x2 : WIDTH, y2 : 0
                            }, 
                            text: {
                                x: 0, y: -10, 
                                dx: 0, dy: 0, 
                                t: (tick/1000000)+'M'
                            }
                            
                        }
                    })}),
                    // content
                    React.createElement('g', {className: 'content'},
                        solidarityByYear.entrySeq().toJS().map(([year, yearSolidarity]) => {
                            const stackElements = ['DF-1-1', 'DF-1-2', 'DF-1-3', 'DF-1-4', 'DF-1-other'];
                            const stackYs = stackElements
                                .map(id => yearSolidarity[id])
                                .map( (amount, i, arr) => sum(arr.slice(0, i)) )
                                .map(rectAmountScale);

                            const stack = stackElements
                                .map((id, i) => {
                                    const amount = yearSolidarity[id];
                                    const height = rectAmountScale(amount);

                                    return {
                                        id,
                                        amount,
                                        height,
                                        y: HEIGHT - HEIGHT_PADDING - height - stackYs[i]
                                    }
                                }) 


                            return React.createElement('g', {className: 'column', transform: `translate(${yearScale(year)})`}, 
                                React.createElement('text', {}, yearSolidarity.solidarityExpenditures),
                                stack.map( ({id, amount, height, y}) => {
                                    return React.createElement('g', {className: id}, 
                                        React.createElement('rect', {x: -columnWidth/2, y, width: columnWidth, height}),
                                        React.createElement('text', {x: -columnWidth/2, y, dy: "1.5em", dx:"0.5em"}, (amount/1000000).toFixed(1))
                                    )
                                })
                            )

                        })
                    )
                )
            )
        ),
        React.createElement('section', {}, 
            React.createElement('h2', {}, `Les publics`),
            React.createElement('p', {}, `bla bla bla`),
            React.createElement('detail-audience-1'),
            React.createElement('detail-audience-2'),
            React.createElement('detail-audience-3'),
            React.createElement('detail-audience-4')
        )
    );

}

const YearSolidarityRecord = Record({
    totalExpenditures: 0,
    solidarityExpenditures: 0,
    'DF-1-1': 0,
    'DF-1-2': 0,
    'DF-1-3': 0,
    'DF-1-4': 0,
    'DF-1-other': 0
})

export default connect(
    state => {
        const { m52InstructionByYear, currentYear } = state;

        const solidarityByYear = m52InstructionByYear.map( (instruction => {
            const {expenditures} = budgetBalance(instruction);
            const agg = m52ToAggregated(instruction);
            //const hierAggByPublic = hierarchicalAggregated(agg, {rd: 'D', fi: 'F'}, PAR_PUBLIC_VIEW);
            const hierAggByPrestation = hierarchicalAggregated(agg, {rd: 'D', fi: 'F'}, PAR_PRESTATION_VIEW);

            const hierAggByPrestationList = flattenTree(hierAggByPrestation);
            console.log('hierAggByPrestationList', hierAggByPrestationList);

            const solidarityExpenditures = hierAggByPrestationList.find(e => e.id === 'DF-1').total;
            const df11 = hierAggByPrestationList.find(e => e.id === 'DF-1-1').total;
            const df12 = hierAggByPrestationList.find(e => e.id === 'DF-1-2').total;
            const df13 = hierAggByPrestationList.find(e => e.id === 'DF-1-3').total;
            const df14 = hierAggByPrestationList.find(e => e.id === 'DF-1-4').total;
            const df1other = solidarityExpenditures - (df11 + df12 + df13 + df14);

            return new YearSolidarityRecord({
                totalExpenditures: expenditures,
                solidarityExpenditures,
                'DF-1-1': df11,
                'DF-1-2': df12,
                'DF-1-3': df13,
                'DF-1-4': df14,
                'DF-1-other': df1other
            })
        }) )


        return {
            currentYear,
            currentYearSolidarity: solidarityByYear.get(currentYear),
            solidarityByYear
        };
    },
    () => ({})
)(FocusSol);