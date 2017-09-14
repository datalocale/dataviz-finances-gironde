import { Record, List } from 'immutable';

import React from 'react';
import { connect } from 'react-redux';

import page from 'page';

import { format } from 'd3-format';

import StackChart from '../../../../shared/js/components/StackChart';
import PageTitle from '../../../../shared/js/components/gironde.fr/PageTitle';
import SecundaryTitle from '../../../../shared/js/components/gironde.fr/SecundaryTitle';
import PrimaryCallToAction from '../../../../shared/js/components/gironde.fr/PrimaryCallToAction';

import FocusDetail from '../FocusDetail';
import FocusDonut from '../FocusDonut';

import {m52ToAggregated, hierarchicalAggregated} from '../../../../shared/js/finance/memoized';
import {flattenTree} from '../../../../shared/js/finance/visitHierarchical';
import {EXPENDITURES} from '../../../../shared/js/finance/constants';

/*

interface FocusSolidarityProps{
    currentYear,
    solidarityByYear: Map<year, YearSolidarityRecord>
}

*/

export function FocusSol({
    currentYear, currentYearSolidarity, solidarityByYear
}) {

    const years = solidarityByYear.keySeq().toJS();

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
            React.createElement(SecundaryTitle, {text: `Les dépenses "Solidarités" augmentent pour tous les publics`}),
            React.createElement(StackChart, {
                xs: years,
                ysByX: solidarityByYear.map(yearSolidarity => (new List([
                    yearSolidarity['DF-2-1'],
                    yearSolidarity['DF-2-2'],
                    yearSolidarity['DF-2-3'],
                    yearSolidarity['DF-2-4'],
                    yearSolidarity['DF-2-other']
                ]))),
                onBrickClicked: (year, id) => { page(`#!/finance-details/${id}`); },
                legendItems: [
                    {
                        id: 'DF-2-1',
                        colorClassName: 'DF-2-1', 
                        text: "Personnes en insertion"
                    },
                    {
                        id: 'DF-2-2',
                        colorClassName: 'DF-2-2', 
                        text: "Personnes handicapées"
                    },
                    {
                        id: 'DF-2-3',
                        colorClassName: 'DF-2-3', 
                        text: "Personnes âgées"
                    },
                    {
                        id: 'DF-2-4',
                        colorClassName: 'DF-2-4', 
                        text: "Enfance"
                    },
                    {
                        id: 'DF-2-other',
                        colorClassName: 'DF-2-other', 
                        text: "Prévention transversale"
                    }
                ]
            })
        ),
        React.createElement('section', {}, 
            React.createElement(SecundaryTitle, {text: `Les actions et les aides varient en fonction des publics`}),
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
                text: `L’Aide Sociale à l'Enfance (ASE) est le service du Département responsable de la protection des mineurs en danger ou en risque de danger (loi du 5 mars 2007). Les missions de l’ASE : apporter un soutien aux familles à leur domicile et accueillir les enfants qui lui sont confiés par leurs parents ou par un juge. Le Département s'occupe également de l’accueil familial qui représente le deuxième mode d’accueil des mineurs.`, 
                highlights: [
                    {
                        strong: "166 M d'€",
                        span: "pour les Maisons d’Enfants à Caractère Sociale"
                    },
                    {
                        strong: "1392 ",
                        span: "enfants accueillis en 2016"
                    },
                    {
                        strong: "835",
                        span: " assistants familiaux pour l'accueil familial"
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
