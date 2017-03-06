import React from 'react';

import { FINANCE_EXPERT, EXPENDITURES } from '../constants/pages';

import Breadcrumb from './Breadcrumb';
import Home from './Home';
import FinanceExpertPage from './FinanceExpertPage';
import FinanceElement from './FinanceElement';

export default function (
    {
        breadcrumb,
        expenditures, revenue,
        onContentChange
    }) {

    // should it be a <main>?
    return React.createElement('div', {},
        (breadcrumb.size >= 2 ? Breadcrumb({ breadcrumb, onContentChange }) : undefined),
        breadcrumb.size === 1 ? // HOME
            React.createElement(Home, {breadcrumb, expenditures, revenue, onContentChange}) : 
            breadcrumb.size === 2 && breadcrumb.last() === FINANCE_EXPERT ? 
                React.createElement(FinanceExpertPage, {}) :
                React.createElement(
                    FinanceElement,
                    {
                        page: breadcrumb.last(),
                        total: breadcrumb.last() === EXPENDITURES ? expenditures : revenue
                    }
                )
    );
}
