import { createStore } from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Record, List, Map as ImmutableMap } from 'immutable';
import { csvParse } from 'd3-dsv';
import page from 'page';

import reducer from './reducer';

import csvStringToM52Instructions from '../../shared/js/finance/csvStringToM52Instructions.js';

import Home from './components/screens/Home';
import FinanceElement from './components/screens/FinanceElement';
import Focus from './components/screens/Focus';
import Strategy from './components/screens/Strategy';
import TotalBudget from './components/screens/TotalBudget';

import { HOME } from './constants/pages';
import { M52_INSTRUCTION_RECEIVED, ATEMPORAL_TEXTS_RECEIVED, YEAR_TEXTS_RECEIVED, LABELS_RECEIVED, BREADCRUMB_CHANGE } from './constants/actions';


let DATA_URL_PREFIX = "..";
if(process.env.NODE_ENV === "production"){
    // The prod URL may be used by external consumers
    DATA_URL_PREFIX = "https://dtc-innovation.github.io/dataviz-finances-gironde";
}

/**
 * 
 * Initialize Redux store + React binding
 * 
 */
const REACT_CONTAINER_SELECTOR = '.cd33-finance-dataviz';
const CONTAINER_ELEMENT = document.querySelector(REACT_CONTAINER_SELECTOR);

const StoreRecord = Record({
    m52Instruction: undefined,
    // ImmutableMap<id, FinanceElementTextsRecord>
    textsById: undefined,
    breadcrumb: undefined
});

const store = createStore(
    reducer,
    new StoreRecord({
        breadcrumb: new List([HOME]),
        textsById: ImmutableMap([[HOME, {label: 'Acceuil'}]])
    })
);



/**
 * 
 * Fetching initial data
 * 
 */
fetch(DATA_URL_PREFIX+'/data/finances/cedi_2015_CA.csv').then(resp => resp.text())
    .then(csvStringToM52Instructions)
    .then(m52Instruction => {
        store.dispatch({
            type: M52_INSTRUCTION_RECEIVED,
            m52Instruction,
        });
    });

[
    DATA_URL_PREFIX+'/data/texts/aggregated-atemporal.csv',
    DATA_URL_PREFIX+'/data/texts/m52-fonctions-atemporal.csv'
].forEach(url => {
    fetch(url).then(resp => resp.text())
        .then(csvParse)
        .then(textList => {
            store.dispatch({
                type: ATEMPORAL_TEXTS_RECEIVED,
                textList
            });
        });
});

[
    DATA_URL_PREFIX+'/data/texts/aggregated-2015.csv',
    DATA_URL_PREFIX+'/data/texts/m52-fonctions-2015.csv'
].forEach(url => {
    fetch(url).then(resp => resp.text())
        .then(csvParse)
        .then(textList => {
            store.dispatch({
                type: YEAR_TEXTS_RECEIVED,
                year: 2015,
                textList
            });
        });
});

[
    DATA_URL_PREFIX+'/data/texts/aggregated-labels.csv',
    DATA_URL_PREFIX+'/data/texts/m52-fonctions-labels.csv'
].forEach(url => {
    fetch(url).then(resp => resp.text())
        .then(csvParse)
        .then(labelList => {
            store.dispatch({
                type: LABELS_RECEIVED,
                labelList
            });
        });
});


/**
 * 
 * Routing
 * 
 */

page('/', () => {
    console.log('in route', '/')

    ReactDOM.render(
        React.createElement(
            Provider,
            { store },
            React.createElement(Home)
        ),
        CONTAINER_ELEMENT
    );
});


page('/total', () => {
    console.log('in route', '/total');

    ReactDOM.render(
        React.createElement(
            Provider,
            { store },
            React.createElement(TotalBudget)
        ),
        CONTAINER_ELEMENT
    );
});

page('/strategie', () => {
    console.log('in route', '/strategie');

    ReactDOM.render(
        React.createElement(
            Provider,
            { store },
            React.createElement(Strategy)
        ),
        CONTAINER_ELEMENT
    );
});

page('/finance-details/:contentId', ({params: {contentId}}) => {
    console.log('in route', '/finance-details', contentId)

    const breadcrumb = store.getState().breadcrumb;

    store.dispatch({
        type: BREADCRUMB_CHANGE,
        breadcrumb: breadcrumb.push(contentId)
    })

    ReactDOM.render(
        React.createElement(
            Provider,
            { store },
            React.createElement(FinanceElement)
        ),
        CONTAINER_ELEMENT
    );
});

page('/focus/:focusId', ({params: {focusId}}) => {
    console.log('in route', '/focus', focusId);

    const breadcrumb = store.getState().breadcrumb;

    store.dispatch({
        type: BREADCRUMB_CHANGE,
        breadcrumb: breadcrumb.push(focusId)
    });

    ReactDOM.render(
        React.createElement(
            Provider,
            { store },
            React.createElement(Focus)
        ),
        CONTAINER_ELEMENT
    );
});


page.redirect(location.pathname, '#!/')
page.redirect(location.pathname+'/', '#!/')


page({ hashbang: true });
window.addEventListener('hashchange', () => {
    page.redirect(location.hash);
});