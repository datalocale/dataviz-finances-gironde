import { createStore } from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import { Record, List, Map as ImmutableMap } from 'immutable';
import { csvParse } from 'd3-dsv';
import page from 'page';

import reducer from './reducer';
import stateToProps from './stateToProps';
import dispatchToProps from './dispatchToProps';

import csvStringToM52Instructions from '../../shared/js/finance/csvStringToM52Instructions.js';

import Home from './components/screens/Home';
import FinanceElement from './components/screens/FinanceElement';
import Focus from './components/screens/Focus';

import { HOME } from './constants/pages';
import { M52_INSTRUCTION_RECEIVED, ATEMPORAL_TEXTS_RECEIVED, YEAR_TEXTS_RECEIVED, LABELS_RECEIVED, BREADCRUMB_CHANGE } from './constants/actions';


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
fetch('../data/finances/cedi_2015_CA.csv').then(resp => resp.text())
    .then(csvStringToM52Instructions)
    .then(m52Instruction => {
        store.dispatch({
            type: M52_INSTRUCTION_RECEIVED,
            m52Instruction,
        });
    });

[
    '../data/texts/aggregated-atemporal.csv',
    '../data/texts/m52-fonctions-atemporal.csv'
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
    '../data/texts/aggregated-2015.csv',
    '../data/texts/m52-fonctions-2015.csv'
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
    '../data/texts/aggregated-labels.csv',
    '../data/texts/m52-fonctions-labels.csv'
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