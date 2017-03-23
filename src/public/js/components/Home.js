import React from 'react';
import { format } from 'currency-formatter';

import { FINANCE_EXPERT, EXPENDITURES, REVENUE } from '../constants/pages';

export default function ({
    breadcrumb,
    expenditures, revenue,
    onContentChange
}) {
    
    return React.createElement('article', {className: 'home'},
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
        ),
        React.createElement(
            'a',
            {
                href: '#',
                onClick(e) {
                    e.preventDefault();
                    onContentChange(breadcrumb.push(REVENUE));
                }
            },
            'Recettes : ', format(revenue, { code: 'EUR' })
        ),
        React.createElement(
            'a',
            {
                href: '#',
                onClick(e) {
                    e.preventDefault();
                    onContentChange(breadcrumb.push(FINANCE_EXPERT));
                }
            },
            'Page expert finance'
        )
    );
}
