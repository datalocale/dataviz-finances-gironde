import React from 'react';
import { connect } from 'react-redux';

import Placeholder from '../../../../shared/js/components/Placeholder';
import {RF, RI, DF, DI} from '../../../../shared/js/finance/constants';
import budgetBalance from '../../../../shared/js/finance/budgetBalance';

import {EXPENDITURES, REVENUE} from '../../../../shared/js/finance/constants';

const MAX_HEIGHT = 50;


export function TotalBudget({budget, urls: {expenditures, revenue}}) {
    
    const max = Math.max(budget.expenditures, budget.revenue);

    const expHeight = MAX_HEIGHT*(budget.expenditures/max)+'vh'; 
    const revHeight = MAX_HEIGHT*(budget.revenue/max)+'vh'; 

    const rfHeight = 100*(budget[RF]/budget.revenue)+'%';
    const riHeight = 100*(budget[RI]/budget.revenue)+'%';
    const diHeight = 100*(budget[DI]/budget.revenue)+'%';
    const dfHeight = 100*(budget[DF]/budget.revenue)+'%';
    

    return React.createElement('article', {className: 'total-budget'},
        React.createElement('h1', {}, 'Dépenses et Recettes du Comptes Administratif 2016'),
        React.createElement('div', {}, `L'exécution du budget 2016, premier de la mandature du président Jean-Luc Gleyze, a été marqué par l’accentuation de la contribution des collectivités locales à la réduction des déficits publics et aux évolution du périmètre d’intervention du département suite au vote des lois MAPTAM et NOTRe. Le Département de la Gironde s’est adapté en resserrant ses marges d’autofinancement et a travaillé sur la maîtrise des dépenses de fonctionnement. Cette rigueur a permis de préserver les dépenses sociales, obligatoires et incompressibles tout en conservant les dépenses d’investissement.


Ainsi les résultats financiers de la Gironde pour cet exercice se traduisent par :
une l’épargne brute en nette amélioration, fruit notamment d’une gestion rigoureuse des dépenses de fonctionnement
une  réduction du besoin de financement par emprunt qui entraîne une baisse du ratio de financement en % des recettes de fonctionnement indicateur de la performance financière
`),
        React.createElement('section', {className: 'viz'},
            React.createElement('div', {className: 'revenue'},
                React.createElement('h1', {}, (budget.revenue/Math.pow(10, 9)).toFixed(2), ' milliards de recette'),
                React.createElement('a', {href: revenue, style: {height: expHeight}}, 
                    React.createElement('div', {className: 'rf', style: {height: rfHeight}}, 'Recettes de fonctionnement'),
                    React.createElement('div', {className: 'ri', style: {height: riHeight}}, "Recettes d'investissement")
                )
            ),
            React.createElement('div', {className: 'expenditures'},
                React.createElement('h1', {}, (budget.expenditures/Math.pow(10, 9)).toFixed(2), ' milliards de dépenses'),
                React.createElement('a', {href: expenditures, style: {height: revHeight}}, 
                    React.createElement('div', {className: 'df', style: {height: dfHeight}}, 'Dépenses de fonctionnement'),
                    React.createElement('div', {className: 'di', style: {height: diHeight}}, "Dépenses d'investissement")
                )
            )
        )
    );
}

export default connect(
    state => {
        const { m52InstructionByYear, currentYear } = state;
        const m52Instruction = m52InstructionByYear.get(currentYear);
        const budget = m52Instruction ? budgetBalance(m52Instruction) : {};

        return {
            budget,
            urls: {
                expenditures: '#!/finance-details/'+EXPENDITURES, 
                revenue: '#!/finance-details/'+REVENUE, 
            }
        };

    },
    () => ({})
)(TotalBudget);