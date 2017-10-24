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

import {urls, PATRIMOINE_PICTO} from '../../constants/resources';

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

    const focusDetailsDenominator = yearDetails ? yearDetails['DF-6'] : NaN;

    return React.createElement('article', {className: 'focus'},
        React.createElement('section', {}, 
            React.createElement(PageTitle, {text: `Présence du Département sur le territoire`}),
            React.createElement(Markdown, {}, 
                `La croissance démographique est constante en Gironde : **+ de 15 000 nouveaux Girondins arrivent chaque année**, ce qui entraîne une augmentation des besoins de suivi et d’accompagnement de la population. Le Département **accorde une vigilance particulière au maintien** de ses frais de personnel et de fonctionnement.`
            )
        ),

        React.createElement('section', {}, 
            React.createElement(SecundaryTitle, {text: 'Carte de la présence du département en Gironde'}),
            React.createElement(Markdown, {}, 
                `Puéricultrice, travailleur social, agent d’exploitation et de voirie, manager, chargé de mission… Sur le territoire de la Gironde, **6000 agents** occupent **125 métiers différents** dans **425 lieux de travail et d’accueil du public**. A chaque lieu sont associés des frais de structure (consommation énergétique, éventuellement loyer) gérés dans le cadre de la stratégie patrimoniale départementale. Explorez la carte ci-dessous pour visualiser le détail de ces frais de fonctionnement.`
            ),
            React.createElement('img', {src: 'http://www.randogps.net/images/cartes/33.png', height: '300'})
        ),

        React.createElement('section', {},
            React.createElement(SecundaryTitle, {text: 'Les frais liés à la présence du Département sur le territoire'}),
            React.createElement(Markdown, {}, 
                `Les frais de fonctionnement sont constitués des charges de structures qui permettent le fonctionnement de la collectivité au quotidien et sur tout le territoire girondin.`
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
            React.createElement(PrimaryCallToAction, {href: '#!/finance-details/DF-6-1', text: `en savoir plus`})
        ),
        React.createElement('section', {}, 
            React.createElement(SecundaryTitle, {text: `Détails de la présence`}),
            React.createElement(Markdown, {}, ``),
            React.createElement(FocusDetail, {
                
                className: 'buildings', 
                
                title: 'Bâtiments', 
                illustrationUrl: urls[PATRIMOINE_PICTO], 
                amount: yearDetails ? yearDetails['DF-6-1'] : undefined,
                proportion: yearDetails ? yearDetails['DF-6-1']/focusDetailsDenominator : 1, 
                text: `Le Département assure l’entretien et la réparation des bâtiments qu’il occupe ou utilise en qualité de locataire, il les équipe, les relie à internet à haut débit et les assure contre les risques.`, 
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
                moreUrl: '#!/finance-details/DF-6-1'
            }),
            React.createElement(FocusDetail, {
                
                className: 'buildings', 
                
                title: 'Achats et fournitures', 
                illustrationUrl: urls[PATRIMOINE_PICTO], 
                amount: yearDetails ? yearDetails['DF-6-1-1'] : undefined,
                proportion: yearDetails ? yearDetails['DF-6-1-1']/focusDetailsDenominator : 1, 
                text: `Il s’agit par exemple du financement de la consommation électrique des bâtiments de la collectivité, de carburant pour le déplacement des agents, le mobilier, les dépenses de consommation d’eau ou de chauffage. ou celle de ses véhicules électriques.`, 
                highlights: [], 
                moreUrl: '#!/finance-details/DF-6-1-1'
            }),
            React.createElement(FocusDetail, {
                
                className: 'buildings', 

                title: 'Fonctionnement de l’assemblée départementale', 
                illustrationUrl: urls[PATRIMOINE_PICTO], 
                amount: yearDetails ? yearDetails['DF-6-3-1'] : undefined,
                proportion: yearDetails ? yearDetails['DF-6-3-1']/focusDetailsDenominator : 1, 
                text: `Cette dépense concerne les indemnités versées aux élus départementaux, à leurs frais ainsi qu’aux rémunérations de leurs collaborateurs`, 
                highlights: [], 
                moreUrl: '#!/finance-details/DI-6-3-1'
            })
        )
    );
}


const displayedContentId = 'DF-6-1';

export default connect(
    state => {
        const { m52InstructionByYear, currentYear, textsById, screenWidth} = state;

        const partitionByYear = m52InstructionByYear.map(m52i => {
            const elementById = makeElementById(
                hierarchicalAggregated(m52ToAggregated(m52i))
            );

            const yearElement = elementById.get(displayedContentId);

            return yearElement && yearElement.children && makePartition(yearElement, elementById.map(e => e.total), textsById)
        });

        const elementById = m52InstructionByYear.get(currentYear) ? makeElementById(
            hierarchicalAggregated(m52ToAggregated(m52InstructionByYear.get(currentYear)))
        ) : undefined;

        const yearDetails = elementById ? {
            'DF-6': elementById.get('DF-6').total,
            'DF-6-1': elementById.get('DF-6-1').total,
            'DF-6-1-1': elementById.get('DF-6-1-1').total,
            'DF-6-3-1': elementById.get('DF-6-3-1').total
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
