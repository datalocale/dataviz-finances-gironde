import { List } from 'immutable';

import React from 'react';
import { connect } from 'react-redux';

import page from 'page';

import StackChart from '../../../../shared/js/components/StackChart';

import PageTitle from '../../../../shared/js/components/gironde.fr/PageTitle';
import SecundaryTitle from '../../../../shared/js/components/gironde.fr/SecundaryTitle';
import PrimaryCallToAction from '../../../../shared/js/components/gironde.fr/PrimaryCallToAction';
import Markdown from '../../../../shared/js/components/Markdown';
import { makeAmountString } from '../../../../shared/js/components/MoneyAmount';

import FocusDetail from '../FocusDetail';
import FocusDonut from '../FocusDonut';


import {aggregatedDocumentBudgetaireNodeTotal} from '../../../../shared/js/finance/AggregationDataStructures.js'
import { flattenTree } from '../../../../shared/js/finance/visitHierarchical';
import { EXPENDITURES, DI } from '../../../../shared/js/finance/constants';

import { makeElementById } from './FinanceElement';

import { urls, COLLEGE_PICTO, ENVIRONNEMENT_AMENAGEMENT_PICTO, PATRIMOINE_PICTO, ROUTES_PICTO, SOUTIEN_COMMUNES_PICTO } from '../../constants/resources';

import colorClassById from '../../colorClassById';

export function FocusSol({
    year, yearInvestments, partitionByYear, population, yearDIDetails, screenWidth, urls
}) {
    const investmentProportion = yearInvestments && yearInvestments.investments / yearInvestments.expenditures;

    const years = partitionByYear.keySeq().toJS();

    // sort all partitions part according to the order in this year's partition
    let thisYearPartition = partitionByYear.get(year);

    const focusDetailsDenominator = yearDIDetails ? yearDIDetails['DI.1'] + yearDIDetails['DI.2'] : NaN;

    return React.createElement('article', { className: 'focus invest' },
        React.createElement('section', {},
            React.createElement(PageTitle, { text: `Focus Investissements` }),
            React.createElement(Markdown, {},
                `Le Département investit en moyenne 200 millions d’euros chaque année pour réaménager les routes, construire de nouveaux collèges, entretenir des espaces naturels sensibles, etc.`
            )
        ),
        React.createElement('section', { className: 'top-infos' },
            React.createElement(FocusDonut, {
                proportion: investmentProportion,
                outerRadius: screenWidth < 400 ? (screenWidth / 2 - 20) : 188,
                innerText: [
                    `de dépenses d'Investissements`,
                    `sur l'ensemble des dépenses`
                ]
            }),
            React.createElement('div', {},
                React.createElement(Markdown, {}, `**En ${year}, le Département de la Gironde a investi ${yearInvestments && makeAmountString(yearInvestments.investments)} soit ${(investmentProportion * 100).toFixed(1)}% de la totalité des dépenses. Ce sont les 1,5 Millions d’habitants en Gironde qui bénéficient directement de ces investissements avec par exemple le réaménagement des routes, la construction de collèges ou encore à l’entretien d’espaces naturels.**`),
                React.createElement(PrimaryCallToAction, { href: '#!/finance-details/DI', text: `en savoir plus` })
            ),
            React.createElement('div', { className: 'people-fraction' },
                React.createElement('div', {},
                    React.createElement('div', {}, `Le Département a investi`),
                    React.createElement('div', { className: 'number' }, yearInvestments && (yearInvestments.investments / population).toFixed(2).replace('.', ',')),
                    React.createElement('div', {}, `euros par habitant en ${year}`)
                )
            )
        ),
        React.createElement('section', {},
            React.createElement(SecundaryTitle, { text: 'Évolution des dépenses d’investissements de 2013 à 2017' }),
            React.createElement(StackChart, {
                WIDTH: screenWidth >= 800 + 80 ?
                    800 :
                    (screenWidth - 85 >= 600 ? screenWidth - 85 : (
                        screenWidth <= 600 ? screenWidth - 10 : 600
                    )),
                portrait: screenWidth <= 600,
                xs: years,
                ysByX: partitionByYear.map(partition => partition.map(part => part.partAmount)),
                onBrickClicked: (year, id) => { page(`#!/finance-details/${id}`); },
                legendItems: thisYearPartition && thisYearPartition.map(p => ({
                    id: p.contentId,
                    className: p.contentId,
                    url: p.url,
                    text: p.texts.label,
                    // .slice to keep 'DI.1' from 'DI.1.4'
                    colorClassName: p.contentId === 'DI.2' ?
                        colorClassById.get(p.contentId.slice(0, 4)) :
                        p.contentId
                })).toArray(),
                yValueDisplay: makeAmountString
            }),
            React.createElement(PrimaryCallToAction, { href: '#!/finance-details/DI', text: `en savoir plus` })
        ),
        React.createElement('section', {},
            React.createElement(SecundaryTitle, { text: `Les secteurs d’investissement` }),
            React.createElement(Markdown, {}, `Le Département ne peut investir que dans les domaines liés à ses compétences. Ses investissements portent par exemple sur la construction, l’entretien et la rénovation des collèges, l'entretien du réseau routier départemental, de son patrimoine immobilier, des espaces naturels sensibles. Il verse également des subventions notamment aux communes pour soutenir leur propre politique d’investissement.`),
            React.createElement(FocusDetail, {
                className: 'colleges',
                title: 'Les Collèges',
                illustrationUrl: urls[COLLEGE_PICTO],
                amount: yearDIDetails ? yearDIDetails['DI.1.1'] : undefined,
                proportion: yearDIDetails ? yearDIDetails['DI.1.1'] / focusDetailsDenominator : 1,
                text: `Le Département construit, entretient, rénove l’ensemble du parc des 105 collèges publics. A la rentrée scolaire 2018-2019, on comptait 60 715 collégiens dans les collèges publics girondins et 12 489 collégiens dans les collèges privés. En 2017, ont été notamment livrés les restructurations des collèges Alfred Mauguin à Gradignan et Claude Massé à Ambarès-et-Lagrave, la salle de sport du Collège Marguerite Duras à Libourne, l’extension de la salle de restauration et des sanitaires au sein du Collège Georges Brassens à Podensac.`,
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
                moreUrl: '#!/finance-details/DI.1.1'
            }),
            React.createElement(FocusDetail, {
                className: 'roads',
                title: 'Infrastructures et routes',
                illustrationUrl: urls[ROUTES_PICTO],
                amount: yearDIDetails ? yearDIDetails['DI.1.2'] : undefined,
                proportion: yearDIDetails ? yearDIDetails['DI.1.2'] / focusDetailsDenominator : 1,
                text: `Le réseau routier girondin est constitué de 6 500 kilomètres de routes départementales, dont 350 kilomètres de pistes cyclables et 1 900 ouvrages d’art (ponts et murs de soutènement). En 2017, la mise en sécurité du réseau se traduira notamment par les réfections de la RD9 à Aillas Mitton, de la RD18 à Génissac Moulon Grézillac, de la RD3 à Hourtin Lesparre, la fin des travaux du pont Eiffel, mais aussi des aménagements de sécurité entre Biganos et Arès, et le contournement de Libourne.  Le Plan départemental de déplacement traduit la volonté du Département d’élargir son action en matière d’organisation du système de déplacements (infrastructures routières, transports collectifs départementaux et covoiturage). Ce Plan prévoit un budget total d’investissement de 14 millions d’euros entre 2017 et 2030.`,
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
                moreUrl: '#!/finance-details/DI.1.2'
            }),
            React.createElement(FocusDetail, {
                className: 'buildings',
                title: 'Patrimoine et Batiments',
                illustrationUrl: urls[PATRIMOINE_PICTO],
                amount: yearDIDetails ? yearDIDetails['DI.1.3'] : undefined,
                proportion: yearDIDetails ? yearDIDetails['DI.1.3'] / focusDetailsDenominator : 1,
                text: `Il s’agit ici de la maintenance et de la rénovation du patrimoine bâti hors immobilier social et des investissements liés à la politique informatique et numérique ou à la sécurisation (digues par exemple)
      Avec 425 sites de travail et lieux d’accueil des publics répartis sur la Gironde, le Département doit entretenir, rénover ou construire près de 1 000 bâtiments, Maison des adolescents, Archives départementales, Hôtel du Département à Bordeaux, Immeuble Gironde et Immeuble Egalité (ex Croix du Palais), centres routiers départementaux, réhabilitation du parc routier etc...`,
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
                moreUrl: '#!/finance-details/DI.1.3'
            }),
            React.createElement(FocusDetail, {
                className: 'environment',
                title: 'Environnement et aménagement',
                illustrationUrl: urls[ENVIRONNEMENT_AMENAGEMENT_PICTO],
                amount: yearDIDetails ? yearDIDetails['DI.1.4'] : undefined,
                proportion: yearDIDetails ? yearDIDetails['DI.1.4'] / focusDetailsDenominator : 1,
                text: `Le Département agit pour la protection et la valorisation des espaces naturels sensibles. Il assure leur gestion, organise des actions de sensibilisation à l'environnement, et permet au public de visiter ces sites préservés en visites libres, ou guidées par des guides naturalistes. 2017 marque la fin des travaux du pôle régional de connaissance de préservation et de valorisation de la biodiversité au domaine de Certes et Graveyron à Audenge. Celui-ci accueille dans le cadre de la préservation de la faune, de la flore et des habitants, le Conservatoire botanique Sud-Atlantique, un centre de sauvegarde de la Ligue pour la Protection des Oiseaux (LPO) et un centre de conservation et d’étude (CCE) de la Direction Régionale des Affaires Culturelles (DRAC).`,
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
                moreUrl: '#!/finance-details/DI.1.4'
            }),
            React.createElement(FocusDetail, {
                className: 'city-subsidy',
                title: 'Subventions',
                illustrationUrl: urls[SOUTIEN_COMMUNES_PICTO],
                amount: yearDIDetails ? yearDIDetails['DI.2'] : undefined,
                proportion: yearDIDetails ? yearDIDetails['DI.2'] / focusDetailsDenominator : 1,
                text: `Le Département est le chef de file des solidarités humaines et territoriales. Il est l’interlocuteur privilégié des collectivités dans le domaine de l’ingénierie territoriale. Dans un contexte économique de plus en plus tendu et face à une pression démographique forte, les communes connaissent des situations économiques très contrastées qui rendent difficile la réalisation de projets pourtant nécessaires. Face à cette situation, le Département les accompagne(offre d’ingénierie avec Gironde Ressources et subventions) pour un développement harmonieux et équilibré du territoire.`,
                highlights: [
                    {
                        strong: "27,3 M€",
                        span: "de subventions aux communes"
                    },
                    {
                        strong: "7,8 M€",
                        span: "de subventions au logement social"
                    },
                    {
                        strong: "3,6 M€",
                        span: "de subventions pour l'accès au très haut débit"
                    }
                ],
                moreUrl: '#!/finance-details/DI.2'
            }),
            React.createElement(FocusDetail, {
                className: 'social-estate',
                title: 'Immobilier social',
                illustrationUrl: urls[SOUTIEN_COMMUNES_PICTO],
                amount: yearDIDetails ? yearDIDetails['DI.1.5'] : undefined,
                proportion: yearDIDetails ? yearDIDetails['DI.1.5'] / focusDetailsDenominator : 1,
                text: `Il s’agit des travaux de construction ou de rénovation des bâtiments sociaux faisant suite au programme Solidarité 2013. En 2017, les travaux ont concerné notamment  le Pôle social de Lormont pour 4.6M€ et la MDSI de Ste Foy la Grande.`,
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
                moreUrl: '#!/finance-details/DI.1.5'
            })
        )
    );
}



export default connect(
    state => {
        const { aggregationByYear, currentYear, textsById, screenWidth } = state;

        const investmentsByYear = aggregationByYear.map(aggregated => {
            const hierAggByPrestationList = flattenTree(aggregated);

            const expenditures = aggregatedDocumentBudgetaireNodeTotal(hierAggByPrestationList.find(e => e.id === EXPENDITURES));
            let investments = aggregatedDocumentBudgetaireNodeTotal(hierAggByPrestationList.find(e => e.id === 'DI.1')) +
            aggregatedDocumentBudgetaireNodeTotal(hierAggByPrestationList.find(e => e.id === 'DI.2'));

            return {
                expenditures,
                investments
            }

        })

        // code adapted from FinanceElement mapStateToProps
        const displayedContentId = DI;

        const partitionByYear = aggregationByYear.map(aggregated => {
            const elementById = makeElementById(aggregated);

            const yearElement = elementById.get(displayedContentId);

            return yearElement && yearElement.children && new List(
                ['DI.1.1', 'DI.1.2', 'DI.1.3', 'DI.1.4', 'DI.1.5', 'DI.2']
                    .map(id => ({
                        contentId: id,
                        partAmount: aggregatedDocumentBudgetaireNodeTotal(elementById.get(id)),
                        texts: textsById.get(id),
                        url: `#!/finance-details/${id}`
                    }))
            )
        });

        /*
        List(children)
        .map(child => ({
            contentId: child.id,
            partAmount: totalById.get(child.id),
            texts: textsById.get(child.id),
            url: `#!/finance-details/${child.id}`
        }))
        */

        // DI details
        const elementById = aggregationByYear.get(currentYear) ? 
            makeElementById(aggregationByYear.get(currentYear)) : 
            undefined;

        const yearDIDetails = elementById ? {
            'DI.1': aggregatedDocumentBudgetaireNodeTotal(elementById.get('DI.1')),
            'DI.2': aggregatedDocumentBudgetaireNodeTotal(elementById.get('DI.2')),
            'DI.1.1': aggregatedDocumentBudgetaireNodeTotal(elementById.get('DI.1.1')),
            'DI.1.2': aggregatedDocumentBudgetaireNodeTotal(elementById.get('DI.1.2')),
            'DI.1.3': aggregatedDocumentBudgetaireNodeTotal(elementById.get('DI.1.3')),
            'DI.1.4': aggregatedDocumentBudgetaireNodeTotal(elementById.get('DI.1.4')),
            'DI.1.5': aggregatedDocumentBudgetaireNodeTotal(elementById.get('DI.1.5')),
            'DI.2.1': aggregatedDocumentBudgetaireNodeTotal(elementById.get('DI.2.1'))
        } : undefined;


        return {
            year: currentYear,
            yearDIDetails,
            yearInvestments: investmentsByYear.get(currentYear),
            partitionByYear,
            population: 1505517, // source : https://www.gironde.fr/le-departement
            screenWidth,
            urls
        };
    },
    () => ({})
)(FocusSol);
