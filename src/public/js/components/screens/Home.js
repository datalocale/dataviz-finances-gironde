import { Map as ImmutableMap } from 'immutable';

import React from 'react';
import { connect } from 'react-redux';
import { sum } from 'd3-array';

import PageTitle from '../../../../shared/js/components/gironde.fr/PageTitle';

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
        explore,
        solidarity, invest, presence
    },
    amounts
}) {
    
    return React.createElement('article', {className: 'home'},
        React.createElement(PageTitle, {text: "Un budget au service d'une solidarité humaine et territoriale"}),
        React.createElement('p', {}, `Collèges, transport scolaire, insertion, aides aux personnes âgées, équipement des zones rurales, environnement Les domaines d’intervention du Département sont vastes mais respectent tous un même objectif : assurer la mission d’aide sociale et de solidarité pour accompagner au mieux les Girondins et les territoires. A ces compétences obligatoires s’ajoutent des actions volontaristes dans de nombreux domaines. Le Département intervient au quotidien pour répondre à une demande de solidarité et de services publics grandissante.`),
        
        React.createElement('section', {className: 'appetizers'},
            React.createElement('div', {
                className: 'fader',
                style: {
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    zIndex: 1
                }
            }) ,
            React.createElement(TotalAppetizer, {
                total: expenditures, // (May 29th) different than what was hardcoded (1.616*Math.pow(10, 9))
                year: currentYear,
                exploreUrl: explore
            }),
            React.createElement(Appetizer, {
                h1: "Un territoire de solidarités",
                numberMain: "120 000", 
                numberSecundary: "prestations allouées",
                description: `Le Département affirme sa vocation sociale et déploie près de 845 millions d’euros pour aider et accompagner les personnes fragilisées.
Il emploie 1 751 agents au service de l’action sociale soit près de 75 millions par an en frais de personnel pour assurer l’efficience et la proximité du service rendus aux publics les plus fragiles. A cela s’ajoute 800 assistants familiaux (et 35 hors Gironde) qui accueillent des enfants faisant l’objet de mesures de placement.`, 
                moreUrl: solidarity
            }),
            React.createElement(Appetizer, {
                h1: "Des investissements ambitieux",
                numberMain: "1 MILLIARD", 
                numberSecundary: "A l’HORIZON 2020",
                description: `Avec une moyenne de 200 millions d’euros investis chaque année durant la mandature, le Département adopte une stratégie volontariste dans une période de réduction budgétaire majeure.`, 
                moreUrl: invest
            }),
            React.createElement(Appetizer, {
                h1: "Une action de proximité",
                numberMain: "125 métiers", 
                numberSecundary: "425 sites",
                description: `Puéricultrice, travailleur social, agent d’exploitation et de voirie, manager, chargé de mission… 6000 agents occupant 125 métiers différents mènent leur mission dans tout le territoire de la Gironde. Il compte 425 lieux de travail et d’accueil du public. Malgré une croissance démographique constante (+ 15 000 nouveaux Girondins en moyenne chaque année) qui entraîne une augmentent des besoins, le Département accorde une vigilance particulière au maintien de ses frais de personnel et de fonctionnement.`, 
                moreUrl: presence
            }) 
        ),
        
        React.createElement('section', {},
            React.createElement('h2', {}, "Comprendre la construction d'un budget"),
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
                amounts
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

        const totalById = elementById.map(e => e.total);

        return Object.assign(
            {
                // All of this is poorly hardcoded. TODO: code proper formulas based on what was transmitted by CD33
                amounts: m52Instruction ? {
                    DotationEtat: totalById.get('RF-5'),
                    FiscalitéDirecte: totalById.get('RF-1'),
                    FiscalitéIndirecte: totalById.get('RF-2') + totalById.get('RF-3'),
                    RecettesDiverses: totalById.get('RF') - sum(['RF-1', 'RF-2', 'RF-3', 'RF-5'].map(i => totalById.get(i))),
                    Solidarité: totalById.get('DF-1'),
                    Interventions: totalById.get('DF-3'),
                    DépensesStructure: (totalById.get('DF') - sum(['DF-1', 'DF-3'].map(i => totalById.get(i))))/2,
                    RIPropre: (totalById.get('RI') - totalById.get('RI-EM')), 
                    Emprunt: totalById.get('RI-EM'),

                    RemboursementEmprunt: totalById.get('DI-EM'), 
                    Routes:totalById.get('DI-1-2'), 
                    Colleges: totalById.get('DI-1-1'), 
                    Amenagement: totalById.get('DI-1-4'), 
                    Subventions: totalById.get('DI-2')
                } : undefined,
                currentYear,
                urls: {
                    explore: '#!/explorer',
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