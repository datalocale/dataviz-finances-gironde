import React from 'react';
import { connect } from 'react-redux';

import { Record } from 'immutable';
import { scaleLinear } from 'd3-scale';
import { min, max, sum } from 'd3-array';
import { format } from 'd3-format';

import LegendList from '../../../../shared/js/components/LegendList';

import PageTitle from '../../../../shared/js/components/gironde.fr/PageTitle';
import PrimaryCallToAction from '../../../../shared/js/components/gironde.fr/PrimaryCallToAction';

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

    // TODO current number (May 29th is 0.51 which is different than what was hardcoded (0.52))
    const solidarityProportion = currentYearSolidarity &&currentYearSolidarity.solidarityExpenditures/currentYearSolidarity.totalExpenditures;


    return React.createElement('article', {className: 'focus'},
        React.createElement('section', {}, 
            React.createElement(PageTitle, {text: 'Solidarités'}),
            React.createElement('p', {}, 
                `Face à la croissance des situations d’exclusion et de précarité, le Département poursuit ses actions sociales innovantes et s’affirme en particulier dans le domaine de l’insertion et de l’accompagnement des personnes en difficultés. Allocations, prestations sociales et solidarité : de nombreux girondins bénéficient d’une ou plusieurs aides dans leurs parcours de vie au quotidien.`
            )
        ),
        React.createElement('section', {className: 'top-infos'}, 
            React.createElement(FocusDonut, {
                proportion: solidarityProportion, 
                outerRadius: 188, 
                innerText: [
                    `de dépenses Solidarités`,
                    `dans le total des dépenses`
                ]
            }),
            React.createElement('div', {}, 
                React.createElement('p', {}, 
                    React.createElement('strong', {},
                        "Avec 120 000 prestations allouées et xxx millions d'euros mobilisés en 2016, les dépenses de Solidarités pour soutenir les personnes fragilisées évoluent de +4,31% par rapport à 2015."
                    ),
                    ``,
                    React.createElement('strong', {}, 
 
                    ),
                    ` `),
                React.createElement(PrimaryCallToAction, {href: '#!/finance-details/DF', text: `en savoir plus`})
            ),
            React.createElement('div', {className: 'people-fraction'}, 
                React.createElement('div', {}, 
                    React.createElement('div', {}, 'Près de'),
                    React.createElement('div', {className: 'number'}, '1/10'),
                    React.createElement('div', {}, `personne accompagnée par le département`)
                )
            )
        ),
        React.createElement('section', {}, 
            React.createElement(PageTitle, {text: `Les dépenses "Solidarités" augmentent pour tous les publics`}),
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
                            const stackElements = ['DF-2-1', 'DF-2-2', 'DF-2-3', 'DF-2-4', 'DF-2-other'];
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
                                        React.createElement('rect', {x: -columnWidth/2, y, width: columnWidth, height, rx: 5, ry: 5})/*,
                                        React.createElement('text', {x: -columnWidth/2, y, dy: "1.3em", dx:"0.5em"}, (amount/1000000).toFixed(1))*/
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
                React.createElement(LegendList, {items: [
                    {
                        className: 'DF-2-other', 
                        text: "Prévention transversale"
                    },
                    {
                        className: 'DF-2-4', 
                        text: "Enfance"
                    },
                    {
                        className: 'DF-2-3', 
                        text: "Personnes âgées"
                    },
                    {
                        className: 'DF-2-2', 
                        text: "Personnes handicapées"
                    },
                    {
                        className: 'DF-2-1', 
                        text: "Personnes en insertion"
                    }
                ]})
            )
        ),
        React.createElement('section', {}, 
            React.createElement('h2', {}, `Les actions et les aides varient en fonction des publics`),
            React.createElement('p', {}, `Les dépenses de solidarité concernent quatre catégories de bénéficiaires : les personnes en insertion ou en situation de précarité, les personnes handicapée, les personnes âgées, les enfants. 
Le Département définit sa propre politique et les actions qu’il met en œuvre pour chacun de ces publics : hébergements, prestations, subventions, allocations.`),
            React.createElement(FocusDetail, {
                className: 'insertion', 
                title: 'Personnes en insertion', 
                illustrationUrl: '../images/Macaron1.png', 
                // (May 29th) different than what was hardcoded ("244 Millions €")
                amount: currentYearSolidarity ? format(".3s")(currentYearSolidarity.get('DF-2-1')) : '', 
                proportion: currentYearSolidarity ? currentYearSolidarity.get('DF-2-1')/currentYearSolidarity.solidarityExpenditures : 1, 
                text: `A lui seul, le RSA (Revenu de Solidarité Active) représente presque 94% des aides allouées aux personnes en insertion. Une personne française ou étrangère d'au moins 25 ans peut en bénéficier si elle remplit plusieurs conditions. https://www.service-public.fr/particuliers/vosdroits/F19778
       `, 
                highlights: [
                    {
                        strong: "+32%",
                        span: "de dépenses depuis 2012"
                    },
                    {
                        strong: "229 M d'€",
                        span: "dédiés au RSA en 2016"
                    },
                    {
                        strong: "+5.5%",
                        span: "d'allocations RSA par rapport à 2015"
                    }
                ], 
                moreUrl: '#!/finance-details/DF-2-1'
            }),
            React.createElement(FocusDetail, {
                className: 'handicap', 
                title: 'Personnes handicapées', 
                illustrationUrl: '../images/Macaron2.png',
                // (May 29th) different than what was hardcoded ("218 Millions €",)
                amount: currentYearSolidarity ? format(".3s")(currentYearSolidarity.get('DF-2-2')) : '', 
                proportion: currentYearSolidarity ? currentYearSolidarity.get('DF-2-2')/currentYearSolidarity.solidarityExpenditures : 1, 
                text: `Trois types d’aides ont été allouées aux personnes handicapées par le Département en 2016 :
- La PCH (Prestation de Compensation du Handicap), a été versée à 9 975 personnes bénéficiaires 
- La prestation d’hébergement a financé 2763 places d'hébergement
- L'ACTP (Allocation de Compensation pour Tiers Personne) a financé l'emploi d'aides à domicile pour 1 128 personnes 
(All`, 
                highlights: [
                    {
                        strong: "73 Millions d'euros",
                        span: "pour compenser la perte d'autonomie"
                    },
                    {
                        strong: "122 Millions d'euros",
                        span: "pour des places d’hébergement"
                    },
                    {
                        strong: "8.25 Millions d'euros",
                        span: "pour l'emploi de 757 aides à domicile"
                    }
                ], 
                moreUrl: '#!/finance-details/DF-2-2'
            }),
            React.createElement(FocusDetail, {
                className: 'elderly', 
                title: 'Personnes âgées', 
                illustrationUrl: '../images/Macaron3.png',
                amount: currentYearSolidarity ? format(".3s")(currentYearSolidarity.get('DF-2-3')) : '',
                proportion: currentYearSolidarity ? currentYearSolidarity.get('DF-2-3')/currentYearSolidarity.solidarityExpenditures : 1, 
                text: `La principale aide en faveur des personnes âgées est l’APA (Allocation Personnalisée d’autonomie). Elle peut être versée soit directement à la personne soit à l’établissement en charge de la personne, selon des critères d'attribution précis. https://www.service-public.fr/particuliers/vosdroits/F10009 L’année 2016 est marquée par l’augmentation des versements de l’APA liée à la mise en place de la loi ASV (Adaptation de la Société au Vieillissement).`,
                highlights: [
                    {
                        strong: "141.6 M d'€ ",
                        span: "versés en 2016 pour l’APA"
                    },
                    {
                        strong: " + 3.53%  ",
                        span: " en 2016 "
                    },
                    {
                        strong: "34 046 ",
                        span: "bénéficiaires en 2016"
                    }
                ], 
                moreUrl: '#!/finance-details/DF-2-3'
            }),
            React.createElement(FocusDetail, {
                className: 'childhood', 
                title: 'Enfance', 
                illustrationUrl: '../images/Macaron4.png',
                // (May 29th) different than what was hardcoded ("168 Millions €")
                amount: currentYearSolidarity ? format(".3s")(currentYearSolidarity.get('DF-2-4')) : '',
                proportion: currentYearSolidarity ? currentYearSolidarity.get('DF-2-4')/currentYearSolidarity.solidarityExpenditures : 1, 
                text: `L’Aide Sociale à l'Enfance (ASE) est le service du Département responsable de la protection des mineurs en danger ou en risque de danger (loi du 5 mars 2007). L’ASE est en collaboration avec : , La PMI (Protection Maternelle et Infantile) , l’UTAS (Union Territoriale d’Action Sociale). Les Missions de l’ASE : apporter un soutien aux familles à leur domicile (éducatif, financier …), accueillir et prendre en charge (également dans l’urgence)les enfants qui lui confiés par leurs parents ou par un juge. Le département s'occupe également de l’accueil familial qui représente le deuxième mode d’accueil avec 800 assistants familiaux en gironde et 35 assistants familiaux hors gironde.`, 
                highlights: [
                    {
                        strong: "166 M d'€",
                        span: "investits dans les Maisons d’Enfants à Caractère Sociale"
                    },
                    {
                        strong: "1392 ",
                        span: "enfants accueuillis en 2016"
                    },
                    {
                        strong: "800",
                        span: " assistants familiaux en Gironde"
                    }
                ], 
                moreUrl: '#!/finance-details/DF-2-4'
            })
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
    'DF-2-4': 0,
    'DF-2-other': 0
})

export default connect(
    state => {
        const { m52InstructionByYear, currentYear } = state;

        const solidarityByYear = m52InstructionByYear.map( ((instruction, year) => {
            const agg = m52ToAggregated(instruction);

            const hierAgg = hierarchicalAggregated(agg);

            const hierAggByPrestationList = flattenTree(hierAgg);

            const expenditures = hierAggByPrestationList.find(e => e.id === EXPENDITURES).total;
            let solidarityExpenditures = hierAggByPrestationList.find(e => e.id === 'DF-1').total;
            const ysrData = {};
            ['DF-1-1', 'DF-1-2', 'DF-1-3', 'DF-1-4', 'DF-2-1', 'DF-2-2', 'DF-2-3', 'DF-2-4'].forEach(id => {
                ysrData[id] = hierAggByPrestationList.find(e => e.id === id).total;
            });

            let df1other = solidarityExpenditures - (ysrData['DF-1-1'] + ysrData['DF-1-2'] + ysrData['DF-1-3'] + ysrData['DF-1-4']);
            let df2other = solidarityExpenditures - (ysrData['DF-2-1'] + ysrData['DF-2-2'] + ysrData['DF-2-3'] + ysrData['DF-2-4']);

            return new YearSolidarityRecord(Object.assign(
                {
                    totalExpenditures: expenditures,
                    solidarityExpenditures,
                    'DF-1-other': df1other,
                    'DF-2-other': df2other
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
