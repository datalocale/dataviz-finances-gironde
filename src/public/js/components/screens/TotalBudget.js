import React from 'react';
import { connect } from 'react-redux';

import Placeholder from '../../../../shared/js/components/Placeholder';
import {RF, RI, DF, DI} from '../../../../shared/js/finance/constants';
import budgetBalance from '../../../../shared/js/finance/budgetBalance';


export function TotalBudget({budget}) {

    console.log('budget', budget);

    const rfHeight = 100*(budget[RF]/budget.revenue)+'%';
    const riHeight = 100*(budget[RI]/budget.revenue)+'%';

    return React.createElement('article', {className: 'total-budget'},
        React.createElement('h1', {}, 'Totaux'),
        React.createElement(Placeholder, {hint: 'description + définitions ?'}),
        React.createElement('section', {className: ''},
            React.createElement('div', {className: 'revenue'},
                React.createElement('h1', {}, (budget.revenue/Math.pow(10, 9)).toFixed(1), ' milliards de recette'),
                React.createElement('div', {style: {height: '70vh'}}, 
                    React.createElement('div', {className: 'rf', style: {height: rfHeight}}, 'Recettes de fonctionnement'),
                    React.createElement('div', {className: 'ri', style: {height: riHeight}}, "Recettes d'investissement")
                )
            )
        )
    );
}

export default connect(
    state => {
        const { m52Instruction } = state;
        const budget = m52Instruction ? budgetBalance(m52Instruction) : {};

        return {budget};

    },
    () => ({})
)(TotalBudget);