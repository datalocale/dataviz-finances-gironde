import { Map as ImmutableMap } from 'immutable';

import React from 'react';
import { connect } from 'react-redux';

import TotalAppetizer from '../TotalAppetizer';
import Appetizer from '../Appetizer';
import BudgetConstructionAnimation from '../BudgetConstructionAnimation'

import budgetBalance from '../../../../shared/js/finance/budgetBalance';
import {flattenTree} from '../../../../shared/js/finance/visitHierarchical.js';
import {m52ToAggregated, hierarchicalAggregated}  from '../../../../shared/js/finance/memoized';

import { SOLIDARITES, INVEST, PRESENCE } from '../../constants/pages';
import { RF, RI, DF, DI } from '../../../../shared/js/finance/constants';


export function Home({
    expenditures,
    currentYear,
    urls: {
        total,
        solidarity, invest, presence
    },
    amounts:{rf, ri, df, di}
}) {
    
    return React.createElement('article', {className: 'home'},
        React.createElement('h1', {}, "Un budget au service d'une solidarité humaine et territoriale"),
        React.createElement('p', {}, "Ce budget est composé de dépenses de fonctionnement, nécessaires aux missions et gestion des services de la collectivité, et de dépenses d’investissement dédiées à des programmes structurants ou stratégiques pour le territoire."),
        
        React.createElement('section', {className: 'appetizers'},
            React.createElement(TotalAppetizer, {
                total: 1.615*Math.pow(10, 9), //expenditures, // number hardcoded for demo TODO : fix the math
                year: currentYear,
                totalUrl: total
            }),
            React.createElement(Appetizer, {
                h1: "Un territoire de solidarités",
                numberMain: "120 000", 
                numberSecundary: "prestations allouées",
                description: `Le Département affirme sa vocation sociale et déploie près de 900 millions d’euros pour aider et accompagner les personnes fragilisées.
                Il emploie 1751 agents au service de l’action sociale soit près de 77 millions par an en frais de personnel pour assurer l’efficience et la proximité du service rendus aux publics les plus fragiles. A cela s’ajoute 937 assistants familiaux qui accueillent des enfants faisant l’objet de mesures de placement.`, 
                moreUrl: solidarity
            }),
            React.createElement(Appetizer, {
                h1: "Des investissements ambitieux",
                numberMain: "1 MILLIARD", 
                numberSecundary: "A l’HORIZON 2020",
                description: `Dans une période de réduction budgétaire majeure, le Département adopte une stratégie volontariste avec 200 millions d’euros investis chaque année durant la mandature.`, 
                moreUrl: invest
            }),
            React.createElement(Appetizer, {
                h1: "Une action de proximité",
                numberMain: "125 métiers", 
                numberSecundary: "277 sites",
                description: `Puéricultrice, travailleur social, agent d’exploitation et de voirie, manager, chargé de mission… Le Département déploie près de 6000 agents au plus près des Girondins, sur 277 sites de travail et d’accueil du public. Cette masse salariale constante malgré l’arrivée de 15 000 nouveaux girondins par an et la croissance des besoins de solidarité représente ????`, 
                moreUrl: presence
            })        
        ),
        
        React.createElement('section', {},
            React.createElement('h1', {}, "Comprendre la construction d'un budget"),
            React.createElement(
                'p',
                {},
                `Le budget prévoit la répartition des recettes et des dépenses sur un exercice. Il est composé de la section de fonctionnement et d’investissement. Contrairement à l’Etat, les Départements, ont l’obligation d’adopter un budget à l’équilibre. Cela signifie que les Départements ne peuvent pas présenter de déficit.`
            ),
            React.createElement(
                'p',
                {},
                `Dans un contexte particulièrement contraint, la préservation de nos équilibres financiers constitue un défi stimulant. Alors comment s’établit notre budget ?`
            ),
            React.createElement(
                BudgetConstructionAnimation,
                {
                    // hardcoded for demo. TODO : fix the math
                    rf: 1.527*Math.pow(10, 9), 
                    ri: 250*Math.pow(10, 6), 
                    df: 1.327*Math.pow(10, 9), 
                    di: 250*Math.pow(10, 6)
                }
            )
            
        )
    );
}


export default connect(
    state => {
        const { m52InstructionByYear, currentYear } = state;
        const m52Instruction = m52InstructionByYear.get(currentYear);
        const balance = m52Instruction ? budgetBalance(m52Instruction) : {};

        const aggregated = m52Instruction && m52ToAggregated(m52Instruction);
        const hierAgg = m52Instruction && hierarchicalAggregated(aggregated);

        let elementById = new ImmutableMap();

        if(m52Instruction){
            flattenTree(hierAgg).forEach(aggHierNode => {
                elementById = elementById.set(aggHierNode.id, aggHierNode);
            });
        }

        return Object.assign(
            {
                amounts: m52Instruction ? {
                    ri: elementById.get(RI).total,
                    rf: elementById.get(RF).total,
                    di: elementById.get(DI).total,
                    df: elementById.get(DF).total,
                } : {},
                currentYear,
                urls: {
                    total: '#!/total',
                    solidarity: '#!/focus/'+SOLIDARITES, 
                    invest: '#!/focus/'+INVEST, 
                    presence: '#!/focus/'+PRESENCE
                }
            },
            balance
        )


    },
    () => ({})
)(Home);