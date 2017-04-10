import React from 'react';
import { connect } from 'react-redux';

import { Record } from 'immutable';
import { scaleLinear } from 'd3-scale';
import { min, max, sum } from 'd3-array';

import FocusDetail from '../FocusDetail';
import FocusDonut from '../FocusDonut';
import D3Axis from '../D3Axis';

import {m52ToAggregated, hierarchicalAggregated} from '../../../../shared/js/finance/memoized';
import {flattenTree} from '../../../../shared/js/finance/visitHierarchical';
import {EXPENDITURES} from '../../../../shared/js/finance/constants';






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
    currentYear, currentYearSolidarity, solidarityByYear, totalExpenditures
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

    const solidarityProportion = currentYearSolidarity &&currentYearSolidarity.solidarityExpenditures/currentYearSolidarity.totalExpenditures


    return React.createElement('article', {className: 'focus'},
        React.createElement('section', {}, 
            React.createElement('h1', {}, 'Solidarité'),
            React.createElement('p', {}, 
                `Face à l’augmentation croissante des situations d’exclusion et de précarité, le Département affirme sa vocation sociale et poursuit avec détermination des politiques concertées et innovantes en particulier dans le domaine de l’insertion et l’accompagnement des personnes en difficultés. En ${currentYear}, ${(solidarityProportion*100).toFixed(0)}% du total des dépenses de fonctionnement du département sont dédiées aux allocations et prestations sociales ou de solidarité.`
            )
        ),
        React.createElement('section', {className: 'top-infos'}, 
            React.createElement(FocusDonut, {
                proportion: solidarityProportion, 
                outerRadius: 188, 
                innerText: [
                    `de la dépense solidarité`,
                    `dans le total dépenses`
                ]
            }),
            React.createElement('div', {}, 
                React.createElement('p', {}, `En 2016, le Département de la Gironde a financé 842 539 675€ au titre de la solidarité soit 52% de la totalité des dépenses. Ce qui représente une évolution de +4,31% par rapport à 2015 Sur une population totale de plus d’1,5 Millions d’habitants, de nombreux Girondins sont des bénéficiaires directs d’une ou plusieurs aides du Département. Chef de file sur les actions de solidarité, il accompagne les plus fragiles dans leurs parcours de vie au quotidien.`),
                React.createElement('a', {href: '#!/finance-details/DF'}, `en savoir plus`)
            ),
            React.createElement('div', {className: 'people-fraction'}, 
                React.createElement('div', {}, 
                    React.createElement('div', {}, 'Près de'),
                    React.createElement('div', {className: 'number'}, '1/10'),
                    React.createElement('div', {}, `personnes accompagnées par le département`)
                )
            )
        ),
        React.createElement('section', {}, 
            React.createElement('h2', {}, `Les publics`),
            React.createElement('p', {}, `bla bla bla`),
            React.createElement(FocusDetail, {
                className: 'insertion', 
                title: 'Personnes en difficulté', 
                illustrationUrl: 'http://res.freestockphotos.biz/pictures/5/5695-an-autumn-landscape-with-green-grass-pv.jpg', 
                amount: 123456789, 
                proportion: 0.25, 
                text: `Principale dépense à destination des personnes en difficulté, le revenu de solidarité active (RSA) assure aux personnes sans ressources un niveau minimum de revenu variable selon la composition du foyer. Le RSA est ouvert, sous certaines conditions, aux personnes d'au moins 25 ans et aux jeunes actifs de 18 à 24 ans s'ils sont parents isolés ou justifient d’une certaine durée d’activité professionnelle. 
                
                En 2016, ce sont 229M€ qui ont été versés au titre de l’Allocation RSA non minorée des indus soit + 5.5% et 12M€ de plus qu’en 2015. La progression initiale avait été estimée à 3.9% En 2016, on constate un ralentissement dans la progression des allocations versées corrélé à une baisse des bénéficiaires.`, 
                highlights: [
                    {
                        strong: "265",
                        span: "millions d'euros"
                    },
                    {
                        strong: "265",
                        span: "millions d'euros"
                    },
                    {
                        strong: "265",
                        span: "millions d'euros"
                    }
                ], 
                //moreUrl:
            }),
            React.createElement(FocusDetail, {
                className: 'handicap', 
                title: 'Personnes handicapées', 
                illustrationUrl: 'http://res.freestockphotos.biz/pictures/5/5695-an-autumn-landscape-with-green-grass-pv.jpg', 
                amount: 123456789, 
                proportion: 0.25, 
                text: `Principale dépense à destination des personnes en difficulté, le revenu de solidarité active (RSA) assure aux personnes sans ressources un niveau minimum de revenu variable selon la composition du foyer. Le RSA est ouvert, sous certaines conditions, aux personnes d'au moins 25 ans et aux jeunes actifs de 18 à 24 ans s'ils sont parents isolés ou justifient d’une certaine durée d’activité professionnelle.
                En 2016, ce sont 229M€ qui ont été versés au titre de l’Allocation RSA non minorée des indus soit + 5.5% et 12M€ de plus qu’en 2015. La progression initiale avait été estimée à 3.9% En 2016, on constate un ralentissement dans la progression des allocations versées corrélé à une baisse des bénéficiaires.`, 
                highlights: [
                    {
                        strong: "265",
                        span: "millions d'euros"
                    },
                    {
                        strong: "265",
                        span: "millions d'euros"
                    },
                    {
                        strong: "265",
                        span: "millions d'euros"
                    }
                ], 
                //moreUrl:
            }),
            React.createElement(FocusDetail, {
                className: 'elderly', 
                title: 'Personness âgées', 
                illustrationUrl: 'http://res.freestockphotos.biz/pictures/5/5695-an-autumn-landscape-with-green-grass-pv.jpg', 
                amount: 123456789, 
                proportion: 0.25, 
                text: `Principale dépense à destination des personnes en difficulté, le revenu de solidarité active (RSA) assure aux personnes sans ressources un niveau minimum de revenu variable selon la composition du foyer. Le RSA est ouvert, sous certaines conditions, aux personnes d'au moins 25 ans et aux jeunes actifs de 18 à 24 ans s'ils sont parents isolés ou justifient d’une certaine durée d’activité professionnelle.

En 2016, ce sont 229M€ qui ont été versés au titre de l’Allocation RSA non minorée des indus soit + 5.5% et 12M€ de plus qu’en 2015. La progression initiale avait été estimée à 3.9% En 2016, on constate un ralentissement dans la progression des allocations versées corrélé à une baisse des bénéficiaires.`, 
                highlights: [
                    {
                        strong: "265",
                        span: "millions d'euros"
                    },
                    {
                        strong: "265",
                        span: "millions d'euros"
                    },
                    {
                        strong: "265",
                        span: "millions d'euros"
                    }
                ], 
                //moreUrl:
            }),
            React.createElement(FocusDetail, {
                className: 'childhood', 
                title: 'Enfance', 
                illustrationUrl: 'http://res.freestockphotos.biz/pictures/5/5695-an-autumn-landscape-with-green-grass-pv.jpg', 
                amount: 123456789, 
                proportion: 0.25, 
                text: `Principale dépense à destination des personnes en difficulté, le revenu de solidarité active (RSA) assure aux personnes sans ressources un niveau minimum de revenu variable selon la composition du foyer. Le RSA est ouvert, sous certaines conditions, aux personnes d'au moins 25 ans et aux jeunes actifs de 18 à 24 ans s'ils sont parents isolés ou justifient d’une certaine durée d’activité professionnelle.

En 2016, ce sont 229M€ qui ont été versés au titre de l’Allocation RSA non minorée des indus soit + 5.5% et 12M€ de plus qu’en 2015. La progression initiale avait été estimée à 3.9% En 2016, on constate un ralentissement dans la progression des allocations versées corrélé à une baisse des bénéficiaires.`, 
                highlights: [
                    {
                        strong: "265",
                        span: "millions d'euros"
                    },
                    {
                        strong: "265",
                        span: "millions d'euros"
                    },
                    {
                        strong: "265",
                        span: "millions d'euros"
                    }
                ], 
                //moreUrl:
            })
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
                            const stackElements = ['DF-1-1', 'DF-1-2', 'DF-1-4', 'DF-1-3', 'DF-1-other'];
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
            const agg = m52ToAggregated(instruction);

            const hierAgg = hierarchicalAggregated(agg);

            const hierAggByPrestationList = flattenTree(hierAgg);

            const expenditures = hierAggByPrestationList.find(e => e.id === EXPENDITURES).total;
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