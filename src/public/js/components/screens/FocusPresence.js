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
import {flattenTree} from '../../../../shared/js/finance/visitHierarchical';
import {EXPENDITURES, DI} from '../../../../shared/js/finance/constants';

import {makePartition, makeElementById} from './FinanceElement';

import {urls} from '../../constants/resources';

import colorClassById from '../../colorClassById';

export function FocusSol({
    year, yearInvestments, partitionByYear, population, yearDIDetails, screenWidth, urls
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
            /*React.createElement(StackChart, {
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
            }),*/
            React.createElement(PrimaryCallToAction, {href: '#!/finance-details/DF-6-1', text: `en savoir plus`})
        ),
        React.createElement('section', {})
    );
}



export default connect(
    state => {
        const { m52InstructionByYear, currentYear, textsById, screenWidth} = state;

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
            population: 1505517, // source : https://www.gironde.fr/le-departement
            screenWidth,
            urls
        };
    },
    () => ({})
)(FocusSol);
