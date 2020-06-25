import { Record, List } from 'immutable';

import React from 'react';
import { connect } from 'react-redux';

import page from 'page';

import StackChart from '../../../../shared/js/components/StackChart';
import {makeAmountString} from '../../../../shared/js/components/MoneyAmount';
import PageTitle from '../../../../shared/js/components/gironde.fr/PageTitle';
import SecundaryTitle from '../../../../shared/js/components/gironde.fr/SecundaryTitle';
import PrimaryCallToAction from '../../../../shared/js/components/gironde.fr/PrimaryCallToAction';
import {aggregatedDocumentBudgetaireNodeTotal} from '../../../../shared/js/finance/AggregationDataStructures.js'
import Markdown from '../../../../shared/js/components/Markdown';
import {flattenTree} from '../../../../shared/js/finance/visitHierarchical';
import {EXPENDITURES} from '../../../../shared/js/finance/constants';


import {urls, INSERTION_PICTO, ENFANCE_PICTO, HANDICAPES_PICTO, PERSONNES_AGEES_PICTO} from '../../constants/resources';

import FocusDetail from '../FocusDetail';
import FocusDonut from '../FocusDonut';

import colorClassById from '../../colorClassById';

/*

interface FocusSolidarityProps{
    currentYear,
    solidarityByYear: Map<year, YearSolidarityRecord>
}

*/

export function FocusSol({
    currentYear, currentYearSolidarity, solidarityByYear, screenWidth, urls
}) {

    const years = solidarityByYear.keySeq().toJS();

    // TODO current number (May 29th is 0.51 which is different than what was hardcoded (0.52))
    const solidarityProportion = currentYearSolidarity &&currentYearSolidarity.solidarityExpenditures/currentYearSolidarity.totalExpenditures;


    return React.createElement('article', {className: 'focus'},
        React.createElement('section', {},
            React.createElement(PageTitle, {text: 'Solidarités'}),
            React.createElement(Markdown, {},
                `Chaque jour, sur l’ensemble du territoire girondin, le Département poursuit le même objectif: réduire les inégalités géographiques et sociales auprès de toutes les populations. Le Département est un acteur incontournable de la lutte contre l’exclusion et la précarité. Il mène des actions sociales innovantes pour accompagner les personnes fragilisées.\
                Les Girondins peuvent ainsi bénéficier d’allocations, prestations sociales et solidarité dans leur parcours de vie au
                quotidien.`
            )
        ),
        React.createElement('section', {className: 'top-infos'},
            React.createElement(FocusDonut, {
                proportion: solidarityProportion,
                outerRadius: screenWidth < 400 ? (screenWidth/2 - 20) : 188,
                innerText: [
                    `de dépenses Solidarités`,
                    `dans le total des dépenses`
                ]
            }),
            React.createElement('div', {},
                React.createElement(Markdown, {},
                    `**Avec 125 000 prestations allouées et ${currentYearSolidarity && (currentYearSolidarity.solidarityExpenditures/1000000).toFixed(0)} millions d'euros mobilisés en ${currentYear}, les dépenses de Solidarités pour soutenir les personnes fragilisées évoluent de +3.43% par rapport à 2018.**`),
                React.createElement(PrimaryCallToAction, {href: '#!/finance-details/DF.2', text: `en savoir plus`})
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
            React.createElement(SecundaryTitle, {text: `LE DEPARTEMENT POURSUIT SES EFFORTS EN MATIERE DE SOLIDARITES HUMAINES`}),
            React.createElement(StackChart, {
                WIDTH: screenWidth >= 800 + 80 ?
                    800 :
                    (screenWidth - 85 >= 600 ? screenWidth - 85 : (
                        screenWidth <= 600 ? screenWidth - 10 : 600
                    )),
                portrait: screenWidth <= 600,
                xs: years,
                ysByX: solidarityByYear.map(yearSolidarity => (new List([
                    yearSolidarity['DF.2.1'],
                    yearSolidarity['DF.2.2'],
                    yearSolidarity['DF.2.3'],
                    yearSolidarity['DF.2.4'],
                    yearSolidarity['DF.2.5']
                ]))),
                legendItems: [
                    {
                        id: 'DF.2.1',
                        colorClassName: colorClassById.get('DF.2.1'),
                        text: "Personnes en insertion",
                        url: `#!/finance-details/DF.2.1`
                    },
                    {
                        id: 'DF.2.2',
                        colorClassName: colorClassById.get('DF.2.2'),
                        text: "Personnes en situation de handicap",
                        url: `#!/finance-details/DF.2.2`
                    },
                    {
                        id: 'DF.2.3',
                        colorClassName: colorClassById.get('DF.2.3'),
                        text: "Personnes âgées",
                        url: `#!/finance-details/DF.2.3`
                    },
                    {
                        id: 'DF.2.4',
                        colorClassName: colorClassById.get('DF.2.4'),
                        text: "Enfance",
                        url: `#!/finance-details/DF.2.4`
                    },
                    {
                        id: 'DF.2.5',
                        colorClassName: colorClassById.get('DF.2.5'),
                        text: "Autres",
                        url: `#!/finance-details/DF.2.5`
                    }
                ],
                yValueDisplay: makeAmountString,
                onBrickClicked: (year, id) => { page(`#!/finance-details/${id}`); }
            })
        ),
        React.createElement('section', {},
            React.createElement(SecundaryTitle, {text: `Les actions et les aides varient en fonction des publics`}),
            React.createElement(Markdown, {}, `On distingue quatre catégories de public pouvant être aidé:

            - les personnes en insertion ou en situation de précarité,
            - les personnes en situation de handicap
            - les personnes âgées
            - les enfants

            Le Département définit sa propre politique et les actions qu’il met en œuvre pour chacun de ces publics : hébergements, prestations, subventions, allocations.`),
            React.createElement(FocusDetail, {
                className: 'insertion',
                title: 'Personnes en insertion',
                illustrationUrl: urls[INSERTION_PICTO],
                amount: currentYearSolidarity ? currentYearSolidarity.get('DF.2.1') : undefined,
                proportion: currentYearSolidarity ? currentYearSolidarity.get('DF.2.1')/currentYearSolidarity.solidarityExpenditures : 1,
                text: `Le Revenu de Solidarité Active (RSA) représente près de 96% des aides financières versées aux personnes en insertion. Si vos ressources financières sont faibles ou inexistantes, vous pouvez demander le RSA. Plus d’infos sur: https://www.gironde.fr/insertion-rsa/vous-etes-un-particulier. `,
                highlights: [
                    {
                        strong: "243,2 M€",
                        span: `dédiés au RSA en ${currentYear}`
                    },
                    {
                        strong: "-0,6%",
                        span: `d'allocations RSA par rapport à ${currentYear-1} en raison d’une baisse des bénéficiaires`
                    }
                ],
                moreUrl: '#!/finance-details/DF.2.1'
            }),
            React.createElement(FocusDetail, {
                className: 'handicap',
                title: 'Personnes en situation de handicap',
                illustrationUrl: urls[HANDICAPES_PICTO],
                amount: currentYearSolidarity ? currentYearSolidarity.get('DF.2.2') : undefined,
                proportion: currentYearSolidarity ? currentYearSolidarity.get('DF.2.2')/currentYearSolidarity.solidarityExpenditures : 1,
                text: `Les aides du Département versées aux personnes en situation de handicap concernent en ${currentYear}:
- la Prestation de Compensation du Handicap (PCH) versée à 7 800 personnes en ${currentYear}.
- la prestation d’hébergement a concerné plus de 3000 bénéficiaires en ${currentYear}.
- l’Allocation Compensation pour Tierce Personne (ACTP) a financé l'emploi d'aides à domicile pour 1 077 personnes en ${currentYear}.

L’objectif de ces aides est de soutenir la vie à domicile, faciliter l’accessibilité au logement, à l’emploi, à la scolarisation et à la vie sociale.`,
                highlights: [
                    {
                        strong: "94.2 M €",
                        span: "pour compenser la perte d'autonomie"
                    },
                    {
                        strong: "140 M€",
                        span: "pour des places d’hébergement"
                    },
                    {
                        strong: "7.5 M€",
                        span: "pour l'emploi de 757 aides à domicile"
                    }
                ],
                moreUrl: '#!/finance-details/DF.2.2'
            }),
            React.createElement(FocusDetail, {
                className: 'elderly',
                title: 'Personnes âgées',
                illustrationUrl: urls[PERSONNES_AGEES_PICTO],
                amount: currentYearSolidarity ? currentYearSolidarity.get('DF.2.3') : undefined,
                proportion: currentYearSolidarity ? currentYearSolidarity.get('DF.2.3')/currentYearSolidarity.solidarityExpenditures : 1,
                text: `L’Allocation Personnalisée d’Autonomie (APA) est la principale aide financière destinée à favoriser l’autonomie des personnes âgées.  Elle est versée directement à la personne ou à l’établissement en charge de cette personne, selon des critères d’attribution précis. https://www.gironde.fr/handicap-grand-age/aides-et-prestations-apa-pch-et-cmi L’application de la loi d’adaptation de la société au vieillissement (ASV) a entraîné une revalorisation de l’APA.`,
                highlights: [
                    {
                        strong: "145.1 M€",
                        span: `versés en ${currentYear} pour l’APA`
                    },
                    {
                        strong: "+ 1%",
                        span: `en ${currentYear}`
                    },
                    {
                        strong: "22 315",
                        span: `bénéficiaires de l'APA à domicile fin ${currentYear}`
                    },
                    {
                        strong: "14 647",
                        span: `bénéficiaires de l'APA en établissement fin ${currentYear}`
                    }
                ],
                moreUrl: '#!/finance-details/DF.2.3'
            }),
            React.createElement(FocusDetail, {
                className: 'childhood',
                title: 'Enfance',
                illustrationUrl: urls[ENFANCE_PICTO],
                amount: currentYearSolidarity ? currentYearSolidarity.get('DF.2.4') : undefined,
                proportion: currentYearSolidarity ? currentYearSolidarity.get('DF.2.4')/currentYearSolidarity.solidarityExpenditures : 1,
                text: `Le Département veille à protéger les enfants et les jeunes majeurs quand leur sécurité, leur santé et leur éducation sont menacées. Ce sont les professionnels de l’Aide sociale à l’enfance (ASE) qui assurent un suivi au plus près des familles. Si le danger rend impossible le maintien dans sa famille, l’enfant est pris en charge et est confié à des professionnels (familles d’accueil, maison d’enfants à caractère social, centre départemental de l’enfance et de la famille, foyer de l’enfance).
https://www.gironde.fr/enfance-et-famille/protection-de-lenfance.`,
                highlights: [
                    {
                        strong: "212.1 M€",
                        span: "pour les Maisons d’Enfants à Caractère Sociale et les hébergements accueillant des enfants"
                    },
                    {
                        strong: "744",
                        span: "assistants familiaux pour l'accueil familial"
                    },
                    {
                        strong: "1151",
                        span: `enfants accueillis en ${currentYear}`
                    }
                ],
                moreUrl: '#!/finance-details/DF.2.4'
            })
        )
    );

}

const YearSolidarityRecord = Record({
    totalExpenditures: 0,
    solidarityExpenditures: 0,
    'DF.1.1': 0,
    'DF.1.2': 0,
    'DF.1.3': 0,
    'DF.1.4': 0,
    'DF.1.other': 0,
    'DF.2.1': 0,
    'DF.2.2': 0,
    'DF.2.3': 0,
    'DF.2.4': 0,
    'DF.2.5': 0
})

export default connect(
    state => {
        const { aggregationByYear, currentYear, screenWidth } = state;

        const solidarityByYear = aggregationByYear.map( (aggregated => {
            const hierAggByPrestationList = flattenTree(aggregated);

            const expenditures = aggregatedDocumentBudgetaireNodeTotal(hierAggByPrestationList.find(e => e.id === EXPENDITURES));
            let solidarityExpenditures = aggregatedDocumentBudgetaireNodeTotal(hierAggByPrestationList.find(e => e.id === 'DF.1'));
            const ysrData = {};
            ['DF.1.1', 'DF.1.2', 'DF.1.3', 'DF.1.4', 'DF.2.1', 'DF.2.2', 'DF.2.3', 'DF.2.4', 'DF.2.5'].forEach(id => {
                ysrData[id] = aggregatedDocumentBudgetaireNodeTotal(hierAggByPrestationList.find(e => e.id === id));
            });

            let df1other = solidarityExpenditures - (ysrData['DF.1.1'] + ysrData['DF.1.2'] + ysrData['DF.1.3'] + ysrData['DF.1.4']);

            return new YearSolidarityRecord(Object.assign(
                {
                    totalExpenditures: expenditures,
                    solidarityExpenditures,
                    'DF.1.other': df1other
                },
                ysrData
            ))
        }))

        return {
            currentYear,
            currentYearSolidarity: solidarityByYear.get(currentYear),
            solidarityByYear,
            screenWidth,
            urls
        };
    },
    () => ({})
)(FocusSol);
