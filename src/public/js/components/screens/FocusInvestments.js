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
import {EXPENDITURES, DI} from '../../../../shared/js/finance/constants';

import {makePartition, makeElementById} from './FinanceElement';

import colorClassById from '../../colorClassById';

export function FocusSol({
    year, yearInvestments, partitionByYear, population, yearDIDetails
}) {

    const investmentProportion = yearInvestments && yearInvestments.investments/yearInvestments.expenditures;

    const years = partitionByYear.keySeq().toJS();

    // sort all partitions part according to the order in this year's partition
    let thisYearPartition = partitionByYear.get(year)
    thisYearPartition = thisYearPartition && thisYearPartition.sort((p1, p2) => p2.partAmount - p1.partAmount);
    const partitionIdsInOrder = thisYearPartition && thisYearPartition.map(p => p.contentId) || [];

    // reorder all partitions so they adhere to partitionIdsInOrder
    partitionByYear = partitionByYear.map(partition => {
        // indexOf inside a .map leads to O(n^2), but lists are 10 elements long max, so it's ok
        return partition && partition.sort((p1, p2) => partitionIdsInOrder.indexOf(p1.contentId) - partitionIdsInOrder.indexOf(p2.contentId))
    });

    const focusDetailsDenominator = yearDIDetails ? yearDIDetails['DI-1'] + yearDIDetails['DI-2'] : NaN;

    return React.createElement('article', {className: 'focus'},
        React.createElement('section', {}, 
            React.createElement(PageTitle, {text: `Focus Investissements`}),
            React.createElement('p', {}, 
                `De nombreux Girondins sont les bénéficiaires directs des investissements du Département, qui s'élèvent en moyenne à 200 millions d’euros chaque année. Ils concernent le réaménagement des routes, la construction de collèges ou l'entretien d’espaces naturels, mais aussi des remboursements d'emprunts, prêts accordés par la collectivité ou des acquisitions mobilières et immobilières.`
            )
        ),
        React.createElement('section', {className: 'top-infos'}, 
            React.createElement(FocusDonut, {
                proportion: investmentProportion, 
                outerRadius: 188, 
                innerText: [
                    `de dépenses d'Investissements`,
                    `sur l'ensemble des dépenses`
                ]
            }),
            React.createElement('div', {}, 
                React.createElement('p', {}, `En 2016, le Département de la Gironde a dépensé 244 877 921,12 € en investissement soit 15,1% de la totalité des dépenses. Ce qui représente une évolution de +3.2% par rapport à 2015. Sur une population totale de plus d’1,5 Millions d’habitants, de nombreux Girondins sont des bénéficiaires directs des investissements du Département grâce réaménagement des routes, au construction de collèges ou encore à l’entretien d’espaces naturels.`),
                React.createElement(PrimaryCallToAction, {href: '#!/finance-details/DI', text: `en savoir plus`})
            ),
            React.createElement('div', {className: 'people-fraction'}, 
                React.createElement('div', {}, 
                    React.createElement('div', {}, ''),
                    React.createElement('div', {className: 'number'}, yearInvestments && (yearInvestments.investments/population).toFixed(2)),
                    React.createElement('div', {}, `euros par habitants`)
                )
            )
        ),
        React.createElement('section', {},
            React.createElement(SecundaryTitle, {text: 'Évolution des dépenses d’investissements de 2009 à 2016'}),
            React.createElement(StackChart, {
                xs: years,
                ysByX: partitionByYear.map(partition => partition.map(part => part.partAmount)),
                onBrickClicked: (year, id) => { page(`#!/finance-details/${id}`); },
                legendItems: thisYearPartition && thisYearPartition.map(p => ({
                    id: p.contentId,
                    className: p.contentId, 
                    url: p.url, 
                    text: p.texts.label,
                    colorClassName: colorClassById.get(p.contentId)
                })).toArray()
            }),
            React.createElement(PrimaryCallToAction, {href: '#!/finance-details/DI', text: `en savoir plus`})
        ),
        React.createElement('section', {}, 
            React.createElement(SecundaryTitle, {text: `Les secteurs d’investissement`}),
            React.createElement('p', {}, `Le Département peut investir directement dans quelques secteurs en fonction de ses compétences. Ces domaines d’action privilégiés sont les collèges, le réseau routier départemental, son patrimoine immobilier, des espaces naturels et classés ainsi que certaines subventions aux communes pour les aider dans leur propre politique d’investissement.`),
            React.createElement(PrimaryCallToAction, {href: '#!/finance-details/DI-1', text: `en savoir plus`}),
            React.createElement(FocusDetail, {
                className: 'colleges', 
                title: 'Les Collèges', 
                illustrationUrl: '../images/Macaron1.png', 
                amount: yearDIDetails ? format(".3s")(yearDIDetails['DI-1-1']) : '',
                proportion: yearDIDetails ? yearDIDetails['DI-1-1']/focusDetailsDenominator : 1, 
                text: `Le Département assure les missions relatives à la construction, l’entretien, l'équipement, la gestion des bâtiments des établissements  et le fonctionnement des collèges. 105 collèges publics girondins accueillent depuis la rentrée 2017 59 864 élèves (contre 59 768 à la rentrée 2016), et 28 collèges privés (12 835 élèves). En 2017, seront notamment livrés les restructurations des collèges Alfred Mauguin à Gradignan et Claude Massé à Ambarès-et-Lagrave, la salle de sport du Collège Marguerite Duras à Libourne, l’extension de la salle de restauration et des sanitaires au sein du Collège Georges Brassens à Podensac.`, 
                highlights: [
                    /*{
                        strong: "",
                        span: ""
                    },
                    {
                        strong: "",
                        span: ""
                    }*/
                ], 
                moreUrl: '#!/finance-details/DI-1-1'
            }),
            React.createElement(FocusDetail, {
                className: 'roads', 
                title: 'Infrastructures et routes', 
                illustrationUrl: '../images/Macaron2.png',
                amount: yearDIDetails ? format(".3s")(yearDIDetails['DI-1-2']) : '',
                proportion: yearDIDetails ? yearDIDetails['DI-1-2']/focusDetailsDenominator : 1, 
                text: `Le réseau routier girondin est constitué de 6 500 kilomètres de routes départementales, dont 350 kms de pistes cyclables et 1 800 ouvrages d’art (ponts et murs de soutènement). En 2017, la mise en sécurité du réseau se traduira notamment par les réfections de la RD9 à Aillas Mitton, de la RD18 à Génissac Moulon Grézillac, de la RD3 à Hourtin Lesparre, la fin des travaux du pont Eiffel, mais aussi des aménagements de sécurité entre Biganos et Arès… Le Plan départemental de déplacement traduit la volonté du Département d’élargir l’action en matière d’organisation du système de déplacements (infrastructures routières, transports collectifs départementaux et covoiturage). Ce Plan prévoit un budget total d’investissement de 14 millions d’euros entre 2017 et 2030.`, 
                highlights: [
                    /*{
                        strong: "",
                        span: ""
                    },
                    {
                        strong: "",
                        span: ""
                    }*/
                ], 
                moreUrl: '#!/finance-details/DI-2-1'
            }),
            React.createElement(FocusDetail, {
                className: 'buildings', 
                title: 'Patrimoine et Batiments', 
                illustrationUrl: '../images/Macaron3.png',
                amount: yearDIDetails ? format(".3s")(yearDIDetails['DI-1-3']) : '',
                proportion: yearDIDetails ? yearDIDetails['DI-1-3']/focusDetailsDenominator : 1, 
                text: `Avec 425 sites de travail et lieux d’accueil des publics répartis sur la Gironde, le Département doit entretenir, rénover ou construire près de 1000 bâtiments : Maison départementale de la solidarité et de l’insertion, Maison des adolescents, archives départementales, Hôtel du Département à Bordeaux,etc. `, 
                highlights: [
                    /*{
                        strong: "",
                        span: ""
                    },
                    {
                        strong: "",
                        span: ""
                    }*/
                ], 
                moreUrl: '#!/finance-details/DI-1-3'
            }),
            React.createElement(FocusDetail, {
                className: 'environment', 
                title: 'Environnement et aménagement', 
                illustrationUrl: '../images/Macaron4.png',
                amount: yearDIDetails ? format(".3s")(yearDIDetails['DI-1-4']) : '',
                proportion: yearDIDetails ? yearDIDetails['DI-1-4']/focusDetailsDenominator : 1, 
                text: `La Gironde compte de nombreux sites classés et protégés pour préserver leur richesse biologique unique : milieux et habitats naturels, faune, flore... L’action du Département relative à la biodiversité, au paysage, aux espaces naturels sensibles se caractérise par  des missions de conservation et de réhabilitation de ces sites, à l’image du  domaine de Certes-et-Graveyron (dont les travaux s’achèveront en septembre 2017) et de  l’île Nouvelle qui font l’objet d’aménagements et d’une gestion spécifique afin que que Girondin puisse découvrir et profiter de leur caractère exceptionnel. `, 
                highlights: [
                    /*{
                        strong: "",
                        span: ""
                    },
                    {
                        strong: "",
                        span: ""
                    }*/
                ], 
                moreUrl: '#!/finance-details/DI-1-4'
            }),
            React.createElement(FocusDetail, {
                className: 'city-subsidy', 
                title: 'Subventions Aux communes', 
                illustrationUrl: '../images/Macaron4.png',
                amount: yearDIDetails ? format(".3s")(yearDIDetails['DI-2-1']) : '',
                proportion: yearDIDetails ? yearDIDetails['DI-2-1']/focusDetailsDenominator : 1, 
                text: `ans un contexte économique de plus en plus tendu et face à une pression démographique forte, les communes connaissent des situations très contrastées qui rendent difficile la réalisation de projets pourtant nécessaires. Face à cette situation,. l’appui des services du Département en termes d’ingénierie et les aides versées permettent de soutenir le développement local et de corriger les inégalités territoriales. Objectif : améliorer la qualité des équipements, maintenir services et commerces de proximité et s’appuyer sur des équipes pluridisciplinaires accompagnant les projets de rénovation et d’urbanisation (mobilité, urbanisme, aménagement paysager, voirie, etc.)… Aux tiers Le Département développe une politique de soutien aux initiatives portées par les entreprises, les associations et les particuliers. Elle leur octroie des aides dans des domaines divers XXX`, 
                highlights: [
                    /*{
                        strong: "",
                        span: ""
                    },
                    {
                        strong: "",
                        span: ""
                    }*/
                ], 
                moreUrl: '#!/finance-details/DI-2-1'
            })
        )
    );

}



export default connect(
    state => {
        const { m52InstructionByYear, currentYear, textsById } = state;

        const investmentsByYear = m52InstructionByYear.map( ((instruction) => {
            const agg = m52ToAggregated(instruction);

            const hierAgg = hierarchicalAggregated(agg);

            const hierAggByPrestationList = flattenTree(hierAgg);

            const expenditures = hierAggByPrestationList.find(e => e.id === EXPENDITURES).total;
            let investments = hierAggByPrestationList.find(e => e.id === 'DI').total;

            return {
                expenditures,
                investments
            }
            
        }))

        // code adapted from FinanceElement mapStateToProps
        const displayedContentId = DI;

        const partitionByYear = m52InstructionByYear.map(m52i => {
            const elementById = makeElementById(
                hierarchicalAggregated(m52ToAggregated(m52i))
            );

            const yearElement = elementById.get(displayedContentId);

            return yearElement && yearElement.children && makePartition(yearElement, elementById.map(e => e.total), textsById)
        });

        // DI details
        const elementById = m52InstructionByYear.get(currentYear) ? makeElementById(
            hierarchicalAggregated(m52ToAggregated(m52InstructionByYear.get(currentYear)))
        ) : undefined;

        const yearDIDetails = elementById ? {
            'DI-1': elementById.get('DI-1').total,
            'DI-2': elementById.get('DI-2').total,
            'DI-1-1': elementById.get('DI-1-1').total,
            'DI-1-2': elementById.get('DI-1-2').total,
            'DI-1-3': elementById.get('DI-1-3').total,
            'DI-1-4': elementById.get('DI-1-4').total,
            'DI-2-1': elementById.get('DI-2-1').total,
        } : undefined;


        return {
            year: currentYear,
            yearDIDetails,
            yearInvestments: investmentsByYear.get(currentYear),
            partitionByYear, 
            population: 1505517 // source : https://www.gironde.fr/le-departement
        };
    },
    () => ({})
)(FocusSol);
