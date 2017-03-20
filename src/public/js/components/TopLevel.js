import React from 'react';

import { HOME } from '../constants/pages';

import Breadcrumb from './Breadcrumb';
import Home from './Home';
import FinanceElement from './FinanceElement';

export default function ({
    breadcrumb,
    textsById,
    expenditures, revenue,
    texts, total, partition,
    onContentChange
}) {
    const displayedElement = breadcrumb.last();

    return React.createElement('div', {},
        (breadcrumb.size >= 2 ? Breadcrumb({ breadcrumb, textsById, onContentChange }) : undefined),
        displayedElement === HOME ?
            React.createElement(Home, { breadcrumb, expenditures, revenue, onContentChange }) :
            React.createElement(
                FinanceElement,
                {
                    contentId: displayedElement,
                    texts, total, partition,
                    onGoDeeper: next => onContentChange(breadcrumb.push(next))
                }
            )
    );
}

