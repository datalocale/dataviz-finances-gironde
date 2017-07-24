import { Map as ImmutableMap } from 'immutable';

import React from 'react';
import { connect } from 'react-redux';

import PageTitle from '../../../../shared/js/components/gironde.fr/PageTitle';

import TotalAppetizer from '../TotalAppetizer';
import Appetizer from '../Appetizer';

import {flattenTree} from '../../../../shared/js/finance/visitHierarchical.js';
import {m52ToAggregated, hierarchicalAggregated}  from '../../../../shared/js/finance/memoized';

import { SOLIDARITES, INVEST, PRESENCE } from '../../constants/pages';
import { EXPENDITURES } from '../../../../shared/js/finance/constants';


export function Home({
    expenditures,
    currentYear,
    urls: {
        explore,
        solidarity, invest, presence
    }
}) {
    
    return React.createElement('article', {className: 'home'},
        React.createElement('div', {}, 
            React.createElement(PageTitle, {text: "Un budget au service d'une solidarité humaine et territoriale"}),
            React.createElement('p', {}, `Collèges, transport scolaire, insertion, aides aux personnes âgées, équipement des zones rurales, environnement... Le  Département intervient au quotidien pour accompagner au mieux les Girondins et leurs territoires. Il finance l’aide sociale et la solidarité dans un contexte de croissance démographique constante : + 15 000 nouveaux Girondins en moyenne chaque année.`)
        ),
        
        React.createElement('section', {className: 'appetizers-container'},
            React.createElement('div', {className: 'appetizers'},

                React.createElement(TotalAppetizer, {
                    total: expenditures, // (May 29th) different than what was hardcoded (1.616*Math.pow(10, 9))
                    year: currentYear,
                    exploreUrl: explore
                }),
                React.createElement(Appetizer, {
                    h1: "Solidarités",
                    numberMain: "120 000", 
                    numberSecundary: "prestations allouées",
                    description: `Le Département affirme sa vocation sociale et déploie près de 845 millions d’euros pour aider et accompagner les personnes fragilisées.`, 
                    moreUrl: solidarity
                }),
                React.createElement(Appetizer, {
                    h1: "Investissements",
                    numberMain: "1 milliard", 
                    numberSecundary: "à l’horizon 2020",
                    description: `Avec une moyenne de 200 millions d’euros investis chaque année durant la mandature, le Département adopte une stratégie volontariste dans une période de réduction budgétaire majeure.`, 
                    moreUrl: invest
                }),
                React.createElement(Appetizer, {
                    h1: "Présence sur le territoire",
                    numberMain: "125 métiers", 
                    numberSecundary: "425 sites",
                    description: `Puéricultrice, travailleur social, agent d’exploitation et de voirie, manager, chargé de mission… 6000 agents mènent leur mission dans des lieux de travail et d’accueil du public répartis dans toute la Gironde.`, 
                    moreUrl: presence
                }) 
            )
        )
    );
}


export default connect(
    state => {
        const { m52InstructionByYear, currentYear } = state;
        const m52Instruction = m52InstructionByYear.get(currentYear);

        const aggregated = m52Instruction && m52ToAggregated(m52Instruction);
        const hierAgg = m52Instruction && hierarchicalAggregated(aggregated);

        let elementById = new ImmutableMap();

        if(m52Instruction){
            flattenTree(hierAgg).forEach(aggHierNode => {
                elementById = elementById.set(aggHierNode.id, aggHierNode);
            });
        }

        const totalById = elementById.map(e => e.total);

        return {
            currentYear,
            urls: {
                explore: '#!/explorer',
                solidarity: '#!/focus/'+SOLIDARITES, 
                invest: '#!/focus/'+INVEST, 
                presence: '#!/focus/'+PRESENCE
            },
            expenditures: totalById.get(EXPENDITURES)
        }


    },
    () => ({})
)(Home);
