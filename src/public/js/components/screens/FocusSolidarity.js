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
                `Face à la croissance des situations d’exclusion et de précarité, le Département poursuit ses actions sociales innovantes, et s’affirme en particulier dans le domaine de l’insertion et de l’accompagnement des personnes en difficultés. En ${currentYear}, ${(solidarityProportion*100).toFixed(0)}% du total des dépenses de fonctionnement du département sont dédiées aux allocations et prestations sociales ou de solidarité.`
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
                React.createElement('p', {}, 
                    React.createElement('strong', {},
                        "En 2016, 50% du total des dépenses du Département sont dédiées aux allocations, aux prestations sociales et à la solidarité."
                    ),
                    ` soit 52% de la totalité des dépenses. `,
                    React.createElement('strong', {}, 
                        "Ce qui représente une évolution de +4,31% par rapport à 2015."
                    ),
                    ` Sur une population totale de plus d’1,5 Millions d’habitants, de nombreux girondins bénéficient d’une ou plusieurs aides du département. Il s’engage à accompagner les plus fragiles dans leurs parcours de vie au quotidien..`),
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
            React.createElement(PageTitle, {text: `Evolution des dépenses de “Solidarités” par public de ${min(years)} à ${max(years)}`}),
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
            React.createElement('h2', {}, `Les publics`),
            React.createElement('p', {}, `Les dépenses de solidarité se concentrent auprès de quatre populations: les personnes en insertion ou en situation de précarité, les personnes handicapée, les personnes âgées, les enfants. L’Etat impose au Département un cadre légal d’intervention pour chaque public.Au sein de ce cadre, le Département définit sa propre politique et les actions qu’il met en œuvre.  Les actions et les aides octroyées par le Département varient en fonction des publics. On retrouve : Des Hébergements qui permet de proposer aux plus fragiles des nuitées et des lits dans des structures sécurisées et adaptées. Des Prestations qui permettent de venir en aide en urgence, de soutenir l’action des associations et des entreprises de l’insertion sociale. Des Subventions pour l’insertion, l’aide à l’action des associations etc … Des Allocations qui permettent de reverser directement à la personne un complément financier : RSA  (Revenu de solidarité active) ; APA (Allocation personnalisée d’autonomie); PCH (Prestation de compensation du handicap).`),
            React.createElement(FocusDetail, {
                className: 'insertion', 
                title: 'Personnes en insertion', 
                illustrationUrl: '../images/Macaron1.png', 
                // (May 29th) different than what was hardcoded ("244 Millions €")
                amount: currentYearSolidarity ? format(".3s")(currentYearSolidarity.get('DF-2-1')) : '', 
                proportion: currentYearSolidarity ? currentYearSolidarity.get('DF-2-1')/currentYearSolidarity.solidarityExpenditures : 1, 
                text: `Le RSA (Revenu de Solidarité Active) assure aux personnes sans ressource un revenu minimum variable selon la composition du foyer. Il est délivré sous certaines conditions. Pour bénéficier du RSA il faut : soit avoir 25 ans ou plus si inactif professionnellement, soit Avoir entre 18 et 24 ans et justifier d’une certaine durée d’activité professionnelle ou être parents isolés. 
                
                En 2016, ce sont 229M€ qui ont été versés au titre de l’Allocation RSA non minorée des indus soit + 5.5% et 12M€ de plus qu’en 2015. La progression initiale avait été estimée à 3.9% En 2016, on constate un ralentissement dans la progression des allocations versées corrélé à une baisse des bénéficiaires.`, 
                highlights: [
                    {
                        strong: "229 M d'€",
                        span: " pour le RSA en 2016"
                    },
                    {
                        strong: "12 M d'€ de plus (+5.5%)",
                        span: "d'allocations RSA par rapport à 2015"
                    },
                    {
                        strong: "baisse",
                        span: "du nombre de bénéficiaires du RSA"
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
                text: `L’aide aux personnes handicapées recouvre trois types d’aides versées par le Département. La PCH (Prestation de Compensation du Handicap) est une aide financière destinée à rembourser les dépenses liées à la perte d’autonomie de la personne. Elle est calculée selon : le degré d’autonomie ; l’âge ; les ressources de la résidence. En 2016, 73Millions d'euros ont été versés pour 9 975 personnes bénéficiaires. Seconde aide, la prestation d’hébergement pour les personnes handicapées est un secteur d’intervention très important pour le Département avec 122 Millions d'euros en 2016. Troisième aide : l'ACTP (Allocation de Compensation pour Tiers Personne) représente 8.25 Millions d'euros versés pour 1 128 personnes en 2016`, 
                highlights: [
                    {
                        strong: "3 aides possibles ",
                        span: "allocation, hébergement, aides à domicile"
                    },
                    {
                        strong: "2 763 places ",
                        span: "d’hébergement en 2016"
                    },
                    {
                        strong: " 757 ",
                        span: "aides à domicile en 2016"
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
                text: `La principale aide en faveur des personnes âgées est l’APA (Allocation Personnalisée d’autonomie). Elle peut être versée soit directement à la personne soit à l’établissement en charge de la personne. L’APA est versée : en cas de perte d’autonomie ; si la personne dispose de l’ASPA (Allocation de Solidarité aux Personnes Âgées) et/ou de l’ASI (Allocation Supplémentaire d’Invalidité) ; si la personne dispose de faibles revenus ; si la personne est invalide et n’a pas atteint l’âge légal de départ à la retraite.L’année 2016 est marquée par l’augmentation des versements de l’APA liée à la mise en place de la loi ASV (Adaptation de la Société  au Vieillissement)`, 
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
