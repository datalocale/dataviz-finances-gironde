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
                        "Avec 120 000 prestations allouées et 813 millions d'euros mobilisés en 2016, les dépenses de Solidarités pour soutenir les personnes fragilisées évoluent de +4,31% par rapport à 2015."
                    ),
                    ` `),
                React.createElement(PrimaryCallToAction, {href: '#!/finance-details/DF-2', text: `en savoir plus`})
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
                                        // changer l'illustration pour intégrer les pictos fournis par la com
                // soit en png
               // illustrationUrl: '../images/Macaron2.png',
                illustrationUrl: 'https://github.com/datalocale/pictoGironde/blob/master/Handicapes.png',
                // soit en svg
                /*
                https://github.com/datalocale/pictoGironde/blob/master/Handicapes.svg
               <svg id="Calque_1" data-name="Calque 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32.35 45.14">
               <title>Handicapés</title>
               <path d="M49,53.87a1.63,1.63,0,0,1-1-.3,1.76,1.76,0,0,1-.59-.77l0-.11V48.45c0-2.25,0-4.58-.15-6.1,0-.18-.13-.79-.15-.87-1.16-5.07-4.36-5.07-5.41-5.07H33.9V30.21l.39.16a10.84,10.84,0,0,0,1.75.55c.62.12.81.15.86.15,1.51.13,3.83.14,6.08.15h1.74V28.29H44.6l-1.47,0c-.87,0-1.74,0-2.56,0a23.15,23.15,0,0,1-3.85-.24,3.26,3.26,0,0,1-2.81-3.56V20.16H31V39.35h9.82a3.26,3.26,0,0,1,3.56,2.81,36.6,36.6,0,0,1,.21,6.38l0,1.19c0,.05,0,.86,0,1.63s0,1.35,0,1.39a3.39,3.39,0,0,0,.6,1.57,2.81,2.81,0,0,0,2.65,1.39h.11a4.7,4.7,0,0,0,1.58-.26l.1,0-.43-1.56Z" transform="translate(-17.21 -10.59)"/>
               <circle cx="15.22" cy="3.55" r="3.55"/>
               <path d="M42.45,41.79H39.17v.13A9.6,9.6,0,0,1,39.25,43a9.39,9.39,0,1,1-10.89-9.27l.11,0V25.82a3.43,3.43,0,0,0-.6-1.57,2.81,2.81,0,0,0-2.65-1.39h-.1a4.69,4.69,0,0,0-1.58.26l-.1,0,.43,1.56H24a1.63,1.63,0,0,1,1,.3,1.76,1.76,0,0,1,.59.77l0,.11v5.2l-.18.07A12.65,12.65,0,1,0,42.51,43c0-.35,0-.7-.05-1.09Z" transform="translate(-17.21 -10.59)"/></svg>
               */
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
                                // changer l'illustration pour intégrer les pictos fournis par la com
                // soit en png
               // illustrationUrl: '../images/Macaron3.png',
                illustrationUrl: 'https://github.com/datalocale/pictoGironde/blob/master/Personnesagees.png',
                // soit en svg
                /*
                https://github.com/datalocale/pictoGironde/blob/master/Personnesagees.svg
               <svg id="Calque_1" data-name="Calque 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21.44 46.22">
               <title>Personnesâgées</title>
               <path d="M41.51,28.37a4.12,4.12,0,0,0-2.54-.8H35.49A21.46,21.46,0,0,1,30.1,27a4.26,4.26,0,0,1-3.57-4.67c0-.14,0-.65,0-1.19V19.57l.28-.29a3.28,3.28,0,0,1,1.39-.88V15.18a6.61,6.61,0,0,0-5.92,5.7,27.09,27.09,0,0,0-.59,3.51V51.63a4.15,4.15,0,0,0,.8,2.57,3.23,3.23,0,0,0,3.15,1.62,6.59,6.59,0,0,0,1.84-.22l-.39-1.39A2.34,2.34,0,0,1,26,53.76a2.46,2.46,0,0,1-1.14-2.09V38.79H29a4.12,4.12,0,0,1,4.36,3.58,31,31,0,0,1,.22,5.72l0,3.55a4.15,4.15,0,0,0,.8,2.57,3.23,3.23,0,0,0,3.15,1.62,6.6,6.6,0,0,0,1.84-.22L39,54.2a2.34,2.34,0,0,1-1.12-.43,2.46,2.46,0,0,1-1.14-2.09V46.54a26.39,26.39,0,0,0-.18-3.9c0-.14-.1-.64-.18-1-.92-4-2.91-5.93-6.25-6H24.83V28.09l1.51.9a10.49,10.49,0,0,0,2.95,1.15c.39.09.84.18,1,.2l.37,0a43.58,43.58,0,0,0,4.69.31h.12c.38,0,1.34-.06,2.22-.06a9.5,9.5,0,0,1,1.46.08,5.53,5.53,0,0,1,.93.31l.61.25V55.81h.58V32.91l1.62.46a6.63,6.63,0,0,0,.22-1.84A3.23,3.23,0,0,0,41.51,28.37Z" transform="translate(-21.69 -9.59)"/>
               <circle cx="12.78" cy="4.12" r="4.12"/>
               </svg>
               */
        
        
        
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
               
                // changer l'illustration pour intégrer les pictos fournis par la com
                // soit en png
               // illustrationUrl: '../images/Macaron4.png', 
                illustrationUrl: 'https://github.com/datalocale/pictoGironde/blob/master/Enfance.png',
                // soit en svg
                /*
                https://github.com/datalocale/pictoGironde/blob/master/Enfance.svg
                <svg id="Calque_1" data-name="Calque 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44.9 44.9">
                <title>Enfance</title>
                <path d="M32.41,11A22.45,22.45,0,1,0,54.86,33.46,22.48,22.48,0,0,0,32.41,11Zm0,41.63A19.18,19.18,0,1,1,51.59,33.46,19.2,19.2,0,0,1,32.41,52.64Z" transform="translate(-9.95 -11)"/>
                <circle cx="16.78" cy="16.72" r="1.91"/><circle cx="28.24" cy="16.72" r="1.91"/>
                <path d="M32.41,43.83a9.93,9.93,0,0,1-7.34-2.67l0,0-1.49,1.49,0,0a12,12,0,0,0,8.86,3.3c4.53,0,7.42-1.64,9.28-3.73L40.2,40.73C38.66,42.47,36.23,43.83,32.41,43.83Z" transform="translate(-9.95 -11)"/></svg>
                */
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
