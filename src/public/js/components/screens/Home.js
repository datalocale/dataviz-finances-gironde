import React from 'react';
import { connect } from 'react-redux';
import { format } from 'currency-formatter';

import budgetBalance from '../../../../shared/js/finance/budgetBalance';
import { EXPENDITURES } from '../../constants/pages';


export function Home({
    expenditures,
    urls: {
        expenditures: expURL, 
        focus1, focus2, focus3, focus4,
        strategy
    }
}) {

    return React.createElement('article', {className: 'home'},
        React.createElement('section', {},
            React.createElement('h1', {}, 'Grosses sommes'),
            React.createElement(
                'a', 
                { href: expURL },
                'Dépenses : ', format(expenditures, { code: 'EUR' })
            )
        ),
        React.createElement('section', {},
            React.createElement('h1', {}, 'Pages focus'),
            React.createElement(
                'a',
                { href: focus1 },
                'Page Focus 1'
            ),
            React.createElement(
                'a',
                { href: focus2 },
                'Page Focus 2'
            ),
            React.createElement(
                'a',
                { href: focus3 },
                'Page Focus 3'
            ),
            React.createElement(
                'a',
                { href: focus4 },
                'Page Focus 5'
            )
        ),
        React.createElement('section', {},
            React.createElement('h1', {}, 'Stratégie budgétaire'),
            React.createElement(
                'a',
                { href: strategy },
                'Stratégie budgétaire'
            )
        )
        
    );
}


export default connect(
    state => {
        const { m52Instruction } = state;
        const balance = m52Instruction ? budgetBalance(m52Instruction) : {};

        return Object.assign(
            {
                urls: {
                    expenditures: '/finance-details/'+EXPENDITURES, 
                    focus1: '/focus/focus1',
                    focus2: '/focus/focus2',
                    focus3: '/focus/focus3',
                    focus4: '/focus/focus4',
                    strategy: '/strategie'
                }
            },
            balance
        )


    },
    () => ({})
)(Home);