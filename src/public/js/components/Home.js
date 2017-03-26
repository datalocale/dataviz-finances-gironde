import React from 'react';
import { format } from 'currency-formatter';

import { EXPENDITURES, REVENUE } from '../constants/pages';

export default function ({
    breadcrumb,
    expenditures, revenue,
    onContentChange
}) {

    return React.createElement('article', {className: 'home'},
        React.createElement('section', {},
            React.createElement('h1', {}, 'Grosses sommes'),
            React.createElement(
                'a',
                {
                    href: '#',
                    onClick(e) {
                        e.preventDefault();
                        onContentChange(breadcrumb.push(EXPENDITURES));
                    }
                },
                'Dépenses : ', format(expenditures, { code: 'EUR' })
            )
        ),
        React.createElement('section', {},
            React.createElement('h1', {}, 'Pages focus'),
            React.createElement(
                'a',
                {
                    href: '#',
                    onClick(e) {
                        e.preventDefault();
                    }
                },
                'Page Focus 1'
            ),
            React.createElement(
                'a',
                {
                    href: '#',
                    onClick(e) {
                        e.preventDefault();
                    }
                },
                'Page Focus 2'
            ),
            React.createElement(
                'a',
                {
                    href: '#',
                    onClick(e) {
                        e.preventDefault();
                    }
                },
                'Page Focus 3'
            ),
            React.createElement(
                'a',
                {
                    href: '#',
                    onClick(e) {
                        e.preventDefault();
                    }
                },
                'Page Focus 4'
            )
        ),
        React.createElement('section', {},
            React.createElement('h1', {}, 'Stratégie budgétaire'),
            React.createElement(
                'a',
                {
                    href: '#',
                    onClick(e) {
                        e.preventDefault();
                    }
                },
                'Stratégie budgétaire'
            )
        )
        
    );
}
