import React from 'react';
import { connect } from 'react-redux';

import Placeholder from '../../../../shared/js/components/Placeholder';
import {RF, RI, DF, DI} from '../../../../shared/js/finance/constants';
import budgetBalance from '../../../../shared/js/finance/budgetBalance';

import {EXPENDITURES, REVENUE} from '../../constants/pages';

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
        React.createElement('h1', {}, 'Totaux'),
        React.createElement(Placeholder, {hint: 'description + définitions ?'}),
        React.createElement('section', {className: 'viz'},
            React.createElement('div', {className: 'revenue'},
                React.createElement('h1', {}, (budget.revenue/Math.pow(10, 9)).toFixed(2), ' milliards de recette'),
                React.createElement('a', {href: expenditures, style: {height: expHeight}}, 
                    React.createElement('div', {className: 'rf', style: {height: rfHeight}}, 'Recettes de fonctionnement'),
                    React.createElement('div', {className: 'ri', style: {height: riHeight}}, "Recettes d'investissement")
                )
            ),
            React.createElement('div', {className: 'expenditures'},
                React.createElement('h1', {}, (budget.expenditures/Math.pow(10, 9)).toFixed(2), ' milliards de dépenses'),
                React.createElement('a', {href: revenue, style: {height: revHeight}}, 
                    React.createElement('div', {className: 'df', style: {height: dfHeight}}, 'Dépenses de fonctionnement'),
                    React.createElement('div', {className: 'di', style: {height: diHeight}}, "Dépenses d'investissement")
                )
            )
        )
    );
}

export default connect(
    state => {
        const { m52Instruction } = state;
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