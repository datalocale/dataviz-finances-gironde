import React from 'react';
import { connect } from 'react-redux';

import { Record } from 'immutable';
import { scaleLinear } from 'd3-scale';
import { min, max, sum } from 'd3-array';
import { format } from 'd3-format';

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

const HEIGHT_PADDING = 70;
const BRICK_SPACING = 6;

const Y_AXIS_MARGIN = 50;

export function FocusSol({
    currentYear, currentYearSolidarity, solidarityByYear
}) {

    const years = solidarityByYear.keySeq().toJS();

    const columnAndMarginWidth = (WIDTH - Y_AXIS_MARGIN)/(years.length+1)
    const columnMargin = columnAndMarginWidth/4;
    const columnWidth = columnAndMarginWidth - columnMargin;
    
    const yearScale = scaleLinear()
        .domain([min(years), max(years)])
        .range([Y_AXIS_MARGIN+columnAndMarginWidth/2, WIDTH-columnAndMarginWidth/2]);

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
            React.createElement('h1', {}, 'Un territoire de Solidarités'),
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
            React.createElement('p', {}, `Les dépenses de solidarité se concentrent auprès de quatre populations : les personnes en insertion ou en situation de précarité, les personnes handicapées, les personnes âgées et les enfants. L’Etat définit pour les départements un cadre légal d’intervention pour chaque public. Le Département à l’intérieur de ce cadre définit sa propre politique et les dispositifs pertinents à mettre en œuvre. Ces dispositifs peuvent se traduire selon chaque personne par : des hébergements, des allocations, des prestations ou subventions (insertion, aide à l’action des associations, …)
            L’allocation permet de reverser directement à la personne un complément financier. Le revenu de solidarité active (RSA), l'allocation personnalisée d'autonomie (APA) La prestation de compensation du handicap (PCH),sont autant d’allocations spécifiques destinés à des publics différents. L’hébergement permet de proposer aux plus fragiles des nuitées et des lits dans des structures sécurisées et adaptées. La prestation permet de venir en aide en urgence, de soutenir l’action des associations et des entreprises de l’insertion sociale.`),
            React.createElement(FocusDetail, {
                className: 'insertion', 
                title: 'Personnes en difficulté', 
                illustrationUrl: '../images/Macaron1.png', 
                amount: currentYearSolidarity ? format(".2s")(currentYearSolidarity.get('DF-2-1')) : '', 
                proportion: currentYearSolidarity ? currentYearSolidarity.get('DF-2-1')/currentYearSolidarity.totalExpenditures : 1, 
                text: `Principale dépense à destination des personnes en difficulté, le revenu de solidarité active (RSA) assure aux personnes sans ressources un niveau minimum de revenu variable selon la composition du foyer. Le RSA est ouvert, sous certaines conditions, aux personnes d'au moins 25 ans et aux jeunes actifs de 18 à 24 ans s'ils sont parents isolés ou justifient d’une certaine durée d’activité professionnelle. 
                
                En 2016, ce sont 229M€ qui ont été versés au titre de l’Allocation RSA non minorée des indus soit + 5.5% et 12M€ de plus qu’en 2015. La progression initiale avait été estimée à 3.9% En 2016, on constate un ralentissement dans la progression des allocations versées corrélé à une baisse des bénéficiaires.`, 
                highlights: [
                    {
                        strong: "229",
                        span: "millions d'euros pour le RSA"
                    },
                    {
                        strong: "+5.5%",
                        span: "d'allocations RSA par rapport à 2015"
                    }
                ], 
                //moreUrl:
            }),
            React.createElement(FocusDetail, {
                className: 'handicap', 
                title: 'Personnes handicapées', 
                illustrationUrl: '../images/Macaron2.png',
                amount: currentYearSolidarity ? format(".2s")(currentYearSolidarity.get('DF-2-2')) : '', 
                proportion: currentYearSolidarity ? currentYearSolidarity.get('DF-2-2')/currentYearSolidarity.totalExpenditures : 1, 
                text: `Principale dépense à destination des personnes en difficulté, le revenu de solidarité active (RSA) assure aux personnes sans ressources un niveau minimum de revenu variable selon la composition du foyer. Le RSA est ouvert, sous certaines conditions, aux personnes d'au moins 25 ans et aux jeunes actifs de 18 à 24 ans s'ils sont parents isolés ou justifient d’une certaine durée d’activité professionnelle.
                En 2016, ce sont 229M€ qui ont été versés au titre de l’Allocation RSA non minorée des indus soit + 5.5% et 12M€ de plus qu’en 2015. La progression initiale avait été estimée à 3.9% En 2016, on constate un ralentissement dans la progression des allocations versées corrélé à une baisse des bénéficiaires.`, 
                highlights: [
                    {
                        strong: "218",
                        span: "millions d'euros"
                    },
                    {
                        strong: "15217",
                        span: "bénéficiaires"
                    },
                    {
                        strong: "-1,5%",
                        span: "personnes concernées par rapport à 2015"
                    }
                ], 
                //moreUrl:
            }),
            React.createElement(FocusDetail, {
                className: 'elderly', 
                title: 'Personness âgées', 
                illustrationUrl: '../images/Macaron3.png', 
                amount: currentYearSolidarity ? format(".2s")(currentYearSolidarity.get('DF-2-3')) : '', 
                proportion: currentYearSolidarity ? currentYearSolidarity.get('DF-2-3')/currentYearSolidarity.totalExpenditures : 1, 
                text: `Principale dépense à destination des personnes en difficulté, le revenu de solidarité active (RSA) assure aux personnes sans ressources un niveau minimum de revenu variable selon la composition du foyer. Le RSA est ouvert, sous certaines conditions, aux personnes d'au moins 25 ans et aux jeunes actifs de 18 à 24 ans s'ils sont parents isolés ou justifient d’une certaine durée d’activité professionnelle.

En 2016, ce sont 229M€ qui ont été versés au titre de l’Allocation RSA non minorée des indus soit + 5.5% et 12M€ de plus qu’en 2015. La progression initiale avait été estimée à 3.9% En 2016, on constate un ralentissement dans la progression des allocations versées corrélé à une baisse des bénéficiaires.`, 
                highlights: [
                    {
                        strong: "194",
                        span: "millions d'euros"
                    },
                    {
                        strong: "32 455",
                        span: "bénéficiaires"
                    },
                    {
                        strong: "-2,6 %",
                        span: "personnes concernées par rapport à 2015"
                    }
                ], 
                //moreUrl:
            }),
            React.createElement(FocusDetail, {
                className: 'childhood', 
                title: 'Enfance', 
                illustrationUrl: '../images/Macaron4.png',
                amount: currentYearSolidarity ? format(".2s")(currentYearSolidarity.get('DF-2-4')) : '', 
                proportion: currentYearSolidarity ? currentYearSolidarity.get('DF-2-4')/currentYearSolidarity.totalExpenditures : 1, 
                text: `Principale dépense à destination des personnes en difficulté, le revenu de solidarité active (RSA) assure aux personnes sans ressources un niveau minimum de revenu variable selon la composition du foyer. Le RSA est ouvert, sous certaines conditions, aux personnes d'au moins 25 ans et aux jeunes actifs de 18 à 24 ans s'ils sont parents isolés ou justifient d’une certaine durée d’activité professionnelle.

En 2016, ce sont 229M€ qui ont été versés au titre de l’Allocation RSA non minorée des indus soit + 5.5% et 12M€ de plus qu’en 2015. La progression initiale avait été estimée à 3.9% En 2016, on constate un ralentissement dans la progression des allocations versées corrélé à une baisse des bénéficiaires.`, 
                highlights: [
                    {
                        strong: "168",
                        span: "millions d'euros"
                    },
                    {
                        strong: "9303",
                        span: "bénéficiaires"
                    },
                    {
                        strong: "+ 0,7%",
                        span: "personnes concernées par rapport à 2015"
                    }
                ], 
                //moreUrl:
            })
        ),
        React.createElement('section', {}, 
            React.createElement('h2', {}, `Evolution des dépenses de “Solidarités” par prestation de ${min(years)} à ${max(years)}`),
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
                                    dy: "2em", 
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
                                anchor: 'left',
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
                                        y: HEIGHT - HEIGHT_PADDING - height - BRICK_SPACING*i - stackYs[i] 
                                    }
                                });

                            return React.createElement('g', {className: 'column', transform: `translate(${yearScale(year)})`}, 
                                stack.map( ({id, amount, height, y}) => {
                                    return React.createElement('g', {className: id}, 
                                        React.createElement('rect', {x: -columnWidth/2, y, width: columnWidth, height, rx: 5, ry: 5}),
                                        React.createElement('text', {x: -columnWidth/2, y, dy: "1.3em", dx:"0.5em"}, (amount/1000000).toFixed(1))
                                    )
                                }),
                                React.createElement('text', {
                                    className: 'total',
                                    y: HEIGHT - HEIGHT_PADDING - BRICK_SPACING*stackElements.length - rectAmountScale(yearSolidarity.solidarityExpenditures), 
                                    dy: "-0.5em", 
                                    textAnchor: 'middle'
                                }, (yearSolidarity.solidarityExpenditures/1000000).toFixed(0)+'M€')
                            )

                        })
                    )
                ),
                React.createElement('ul', {className: 'legend'},
                    React.createElement('li', {className: 'DF-1-other'},
                        React.createElement('span', {className: 'color'}), ' ',
                        "Prévention santé, sexualité"
                    ),
                    React.createElement('li', {className: 'DF-1-3'},
                        React.createElement('span', {className: 'color'}), ' ',
                        "PCH-ACTP"
                    ),
                    React.createElement('li', {className: 'DF-1-4'},
                        React.createElement('span', {className: 'color'}), ' ',
                        "APA"
                    ),
                    React.createElement('li', {className: 'DF-1-2'},
                        React.createElement('span', {className: 'color'}), ' ',
                        "RSA"
                    ),
                    React.createElement('li', {className: 'DF-1-1'},
                        React.createElement('span', {className: 'color'}), ' ',
                        "Hébergement"
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
    'DF-1-other': 0,
    'DF-2-1': 0,
    'DF-2-2': 0,
    'DF-2-3': 0,
    'DF-2-4': 0
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
            const ysrData = {};
            ['DF-1-1', 'DF-1-2', 'DF-1-3', 'DF-1-4', 'DF-2-1', 'DF-2-2', 'DF-2-3', 'DF-2-4'].forEach(id => {
                ysrData[id] = hierAggByPrestationList.find(e => e.id === id).total;
            });

            const df1other = solidarityExpenditures - (ysrData['DF-1-1'] + ysrData['DF-1-2'] + ysrData['DF-1-3'] + ysrData['DF-1-4']);

            return new YearSolidarityRecord(Object.assign(
                {
                    totalExpenditures: expenditures,
                    solidarityExpenditures,
                    'DF-1-other': df1other
                },
                ysrData
            ))
        }))

        return {
            currentYear,
            currentYearSolidarity: solidarityByYear.get(currentYear),
            solidarityByYear
        };
    },
    () => ({})
)(FocusSol);