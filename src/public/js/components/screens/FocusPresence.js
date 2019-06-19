import React from 'react';
import { connect } from 'react-redux';

import page from 'page';

import StackChart from '../../../../shared/js/components/StackChart';

import PageTitle from '../../../../shared/js/components/gironde.fr/PageTitle';
import SecundaryTitle from '../../../../shared/js/components/gironde.fr/SecundaryTitle';
import PrimaryCallToAction from '../../../../shared/js/components/gironde.fr/PrimaryCallToAction';
import Markdown from '../../../../shared/js/components/Markdown';
import {makeAmountString} from '../../../../shared/js/components/MoneyAmount';

import {m52ToAggregated, hierarchicalAggregated} from '../../../../shared/js/finance/memoized';

import {makePartition, makeElementById} from './FinanceElement';
import FocusDetail from '../FocusDetail';

import {urls, AGENTS_PICTO, CARBURANT_PICTO, ELECTRICITE_PICTO, CARTE_PRESENCE_HTML} from '../../constants/resources';

import colorClassById from '../../colorClassById';

export function FocusSol({
    year, partitionByYear, yearDetails, screenWidth, urls
}) {

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

    const focusDetailsDenominator = yearDetails ? yearDetails['DF.6'] : NaN;

    return React.createElement('article', {className: 'focus presence'},
        React.createElement('section', {},
            React.createElement(PageTitle, {text: `Présence du Département sur le territoire`}),
            React.createElement(Markdown, {},
                `La Gironde attire chaque année **entre 18 000 et 20 000 nouveaux habitants**. Cet afflux est un véritable défi puisque plus d’habitants signifie également plus de services publics à mettre en oeuvre. Le Département **accorde une attention particulière au maintien** de la qualité des services offerts à toutes les Girondines et tous les Girondins sur l’ensemble du territoire.`
            )
        ),

        React.createElement('section', {className: 'focus-map'},
            React.createElement(SecundaryTitle, {text: 'Carte de la présence du département en Gironde'}),
            React.createElement(Markdown, {},
                `Puéricultrices, travailleurs sociaux, agents d’exploitation et de voirie, adjoints techniques territoriaux des établissements d’enseignement, juristes… **6 670** agents exercent **125 métiers** dans **425 lieux de travail et d’accueil du public**. A chaque lieu sont associés des frais de structure (consommation énergétique, éventuellement loyer) gérés dans le cadre de la stratégie patrimoniale départementale. Explorez la carte ci-dessous pour visualiser le détail de ces frais de fonctionnement.`
            ),
            React.createElement('iframe', {src: urls[CARTE_PRESENCE_HTML], sandbox: 'allow-scripts'})
        ),

        React.createElement('section', {},
            React.createElement(SecundaryTitle, {text: 'Les frais liés à la présence du Département sur le territoire'}),
            React.createElement(Markdown, {},
                `Parmi les frais de fonctionnement on trouve des charges de structure qui permettent le fonctionnement de la collectivité au quotidien et sur tout le territoire girondin.`
            ),
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
                    colorClassName: colorClassById.get(p.contentId)
                })).toArray(),
                yValueDisplay: makeAmountString
            }),
            React.createElement(PrimaryCallToAction, {href: '#!/finance-details/DF.6.1', text: `en savoir plus`})
        ),
        React.createElement('section', {},
            React.createElement(SecundaryTitle, {text: `Détails des frais liés à la présence du Département sur le territoire`}),
            React.createElement(Markdown, {}, ``),
            React.createElement(FocusDetail, {

                className: 'buildings',

                title: 'Prestations de services',
                illustrationUrl: urls[ELECTRICITE_PICTO],
                amount: yearDetails ? yearDetails['DF.6.1.2'] : undefined,
                proportion: yearDetails ? yearDetails['DF.6.1.2']/focusDetailsDenominator : 1,
                text: `Le Département assure l’entretien et la réparation des bâtiments qu’il occupe ou utilise en qualité de locataire : il les équipe, les relie à internet à haut débit et les assure contre les risques.`,
                highlights: [
                    {
                        strong: '2,1M€',
                        span: `locations immobilières (-38%)`
                    },
                    {
                        strong: '2,7M€',
                        span: `entretien et de maintenance des bâtiments (+3.9%)`
                    },
                    {
                        strong: '1,1M€',
                        span: `contrats d’assurance (-4.5%)`
                    }
                ],
                moreUrl: '#!/finance-details/DF.6.1.2'
            }),
            React.createElement(FocusDetail, {

                className: 'buildings',

                title: 'Achats et fournitures',
                illustrationUrl: urls[CARBURANT_PICTO],
                amount: yearDetails ? yearDetails['DF.6.1.1'] : undefined,
                proportion: yearDetails ? yearDetails['DF.6.1.1']/focusDetailsDenominator : 1,
                text: `Cela correspond par exemple au financement de la consommation électrique des bâtiments de la collectivité, du carburant pour le déplacement des agents, de l’achat de mobilier, des dépenses de consommation d’eau ou de chauffage ou encore celle de ses véhicules électriques.`,
                highlights: [
                    {
                        strong: '1,3M€',
                        span: `consommation énergétique (-1,1%)`
                    },
                    {
                        strong: '561 000€',
                        span: `dépenses de carburant (+0.7%)`
                    },
                    {
                        strong: '448 000€',
                        span: `dépenses de fourniture (-2.3%)`
                    }
                ],
                moreUrl: '#!/finance-details/DF.6.1.1'
            }),
            React.createElement(FocusDetail, {

                className: 'buildings',

                title: 'Frais divers',
                illustrationUrl: urls[AGENTS_PICTO],
                amount: yearDetails ? yearDetails['DF.6.1.3'] : undefined,
                proportion: yearDetails ? yearDetails['DF.6.1.3']/focusDetailsDenominator : 1,
                text: `Cela concerne en particulier les honoraires, le conseil, les frais de réception, les frais télécom, l’affranchissement, les services bancaires…`,
                highlights: [
                    {
                        strong: '838 362€',
                        span: `frais de nettoyage de locaux (+1.16%)`
                    },
                    {
                        strong: '833 375€',
                        span: `frais d’affranchissement (-13,7%)`
                    },
                    {
                        strong: '1.7 M€',
                        span: `frais de télécommunications (+2%)`
                    }
                ],
                moreUrl: '#!/finance-details/DF.6.1.3'
            })
        )
    );
}


const displayedContentId = 'DF.6.1';

export default connect(
    state => {
        const { docBudgByYear, corrections, currentYear, textsById, screenWidth} = state;

        const partitionByYear = docBudgByYear.map(m52i => {
            const elementById = makeElementById(
                hierarchicalAggregated(m52ToAggregated(m52i, corrections))
            );

            const yearElement = elementById.get(displayedContentId);

            return yearElement && yearElement.children && makePartition(yearElement, elementById.map(e => e.total), textsById)
        });

        const elementById = docBudgByYear.get(currentYear) ? makeElementById(
            hierarchicalAggregated(m52ToAggregated(docBudgByYear.get(currentYear), corrections))
        ) : undefined;

        const yearDetails = elementById ? {
            'DF.6': elementById.get('DF.6').total,
            'DF.6.1.1': elementById.get('DF.6.1.1').total,
            'DF.6.1.2': elementById.get('DF.6.1.2').total,
            'DF.6.1.3': elementById.get('DF.6.1.3').total
        } : undefined;


        return {
            year: currentYear,
            yearDetails,
            partitionByYear,
            screenWidth,
            urls
        };
    },
    () => ({})
)(FocusSol);
