import React from 'react';
import { connect } from 'react-redux';

import Placeholder from '../../../../shared/js/components/Placeholder';

import budgetBalance from '../../../../shared/js/finance/budgetBalance';
import { EXPENDITURES, SOLIDARITES, INVEST, PRESENCE } from '../../constants/pages';


export function Home({
    expenditures,
    urls: {
        total,
        solidarities, invest, presence,
        strategy
    }
}) {

    return React.createElement('article', {className: 'home'},
        React.createElement('h1', {}, "La Gironde : un budget au service d'une solidarité humaine et territoriale"),
        
        React.createElement('section', {className: 'total-budget'},
            React.createElement(
                'a', 
                { href: total },
                React.createElement('h1', {}, 
                    (expenditures/Math.pow(10, 9)).toFixed(3).replace('.', ','),
                    ' milliards de dépenses en 2016'
                )
            )
        ),
        React.createElement('section', {},
            React.createElement('h1', {}, 'Sujets à la loupe'),
            React.createElement('ul', {className: 'focuses'},
                React.createElement('li', {},
                    React.createElement(
                        'a',
                        { href: solidarities },
                        'Solidarités'
                    )
                ),
                React.createElement('li', {},
                    React.createElement(
                        'a',
                        { href: invest },
                        'Investir pour le territoire'
                    )
                ),
                React.createElement('li', {},
                    React.createElement(
                        'a',
                        { href: presence },
                        'Être présent sur le territoire'
                    )
                )
            )
        ),
        React.createElement('section', {},
            React.createElement('h1', {}, 'Stratégie budgétaire'),
            React.createElement(
                'a',
                { href: strategy },
                React.createElement(Placeholder, {hint: "Comprendre la stratégie budgétaire + illustration"})
            )
        ),
        React.createElement('p', {},
            "Et si vous voulez creuser vous-même, vous pouvez toujours télécharger les ",
            React.createElement('a', {href:'#'}, 
                'données open data sous format CSV'
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
                    total: '#!/total',
                    solidarities: '#!/focus/'+SOLIDARITES, 
                    invest: '#!/focus/'+INVEST, 
                    presence: '#!/focus/'+PRESENCE,
                    strategy: '#!/strategie'
                }
            },
            balance
        )


    },
    () => ({})
)(Home);