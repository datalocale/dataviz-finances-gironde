import React from 'react';

import { HOME, FINANCE_EXPERT, EXPENDITURES } from '../constants/pages';

import Breadcrumb from './Breadcrumb';
import Home from './Home';
import FinanceExpertPage from './FinanceExpertPage';
import FinanceElement from './FinanceElement';

export default function ({
    breadcrumb,
    textsById,
    expenditures, revenue,
    onContentChange
}) {
    console.log('textsById', textsById.toJS())

    const displayedElement = breadcrumb.last();

    // should it be a <main>?
    return React.createElement('div', {},
        (breadcrumb.size >= 2 ? Breadcrumb({ breadcrumb, textsById, onContentChange }) : undefined),
        displayedElement === HOME ?
            React.createElement(Home, { breadcrumb, expenditures, revenue, onContentChange }) :
            breadcrumb.size === 2 && displayedElement === FINANCE_EXPERT ?
                React.createElement(FinanceExpertPage, {}) :
                React.createElement(
                    FinanceElement,
                    {
                        page: displayedElement,
                        texts: textsById.get(displayedElement),
                        total: displayedElement === EXPENDITURES ? expenditures : revenue
                    }
                )
    );
}
