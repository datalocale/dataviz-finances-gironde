import { createStore } from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Record, Map as ImmutableMap, List, Set as ImmutableSet } from 'immutable';
import { csv, xml, json } from 'd3-fetch';
import page from 'page';

import {urls, FINANCE_DATA, AGGREGATED_ATEMPORAL, AGGREGATED_TEMPORAL} from './constants/resources';
import reducer from './reducer';

import {LigneBudgetRecord, DocumentBudgetaire} from '../../shared/js/finance/DocBudgDataStructures.js';
import { fromXMLDocument } from '../../shared/js/finance/planDeCompte';
import {makeChildToParent, flattenTree} from '../../shared/js/finance/visitHierarchical.js';
import hierarchicalM52 from '../../shared/js/finance/hierarchicalM52.js';

import Breadcrumb from '../../shared/js/components/gironde.fr/Breadcrumb';
import Home from './components/screens/Home';
import FinanceElement from './components/screens/FinanceElement';
import FocusSolidarity from './components/screens/FocusSolidarity';
import FocusInvestments from './components/screens/FocusInvestments';
import FocusPresence from './components/screens/FocusPresence';

import ExploreBudget from './components/screens/ExploreBudget';

import { HOME, SOLIDARITES, INVEST, PRESENCE } from './constants/pages';
import {
    FINANCE_DATA_RECEIVED, ATEMPORAL_TEXTS_RECEIVED, TEMPORAL_TEXTS_RECEIVED, PLAN_DE_COMPTE_RECEIVED,
    FINANCE_DETAIL_ID_CHANGE,
} from './constants/actions';


import {fonctionLabels} from '../../../build/finances/m52-strings.json';


/**
 *
 * Initialize Redux store + React binding
 *
 */
const REACT_CONTAINER_SELECTOR = '.cd33-finance-dataviz';
const CONTAINER_ELEMENT = document.querySelector(REACT_CONTAINER_SELECTOR);

/*
    Dirty (temporary) hacks to fix the gironde.fr pages so the content displays properly
*/
if(process.env.NODE_ENV === 'production'){
    const main = document.body.querySelector('main');
    const columnsEl = main.querySelector('.columns');
    const rowEl = main.querySelector('.row');

    const elementsToMove = main.querySelectorAll('.columns > :nth-child(-n+3)');

    Array.from(elementsToMove).forEach(e => {
        if(e.querySelector('h1')){
            // remove server-generated h1
            e.remove();
        }
        else{
            main.insertBefore(e, rowEl);
        }
    });

    main.insertBefore(CONTAINER_ELEMENT, rowEl);
}

// Breadcrumb
const BREADCRUMB_CONTAINER = process.env.NODE_ENV === "production" ?
    document.body.querySelector('.breadcrumb').parentNode :
    document.body.querySelector('nav');

const DEFAULT_BREADCRUMB = List([
    {
        text: 'Accueil',
        url: '/'
    },
    {
        text: 'Le Département',
        url: '/le-departement'
    },
    {
        text: `Un budget au service des solidarités humaine et territoriale`,
        url: '#'
    }
]);


const StoreRecord = Record({
    docBudgByYear: undefined,
    aggregationByYear: undefined,
    planDeCompteByYear: undefined,
    currentYear: undefined,
    explorationYear: undefined,
    // ImmutableMap<id, FinanceElementTextsRecord>
    textsById: undefined,
    financeDetailId: undefined,
    screenWidth: undefined
});

const store = createStore(
    reducer,
    new StoreRecord({
        docBudgByYear: new ImmutableMap(),
        aggregationByYear: new ImmutableMap(),
        planDeCompteByYear: new ImmutableMap(),
        currentYear: (new Date()).getFullYear() - 1,
        explorationYear: (new Date()).getFullYear() - 1,
        financeDetailId: undefined,
        textsById: ImmutableMap([[HOME, {label: 'Acceuil'}]]),
        screenWidth: window.innerWidth
    })
);



store.dispatch({
    type: ATEMPORAL_TEXTS_RECEIVED,
    textList: Object.keys(fonctionLabels)
        .map(fonction => ({
            id: `M52-DF-${fonction}`,
            label: fonctionLabels[fonction]
        }))
});
store.dispatch({
    type: ATEMPORAL_TEXTS_RECEIVED,
    textList: Object.keys(fonctionLabels)
        .map(fonction => ({
            id: `M52-DI-${fonction}`,
            label: fonctionLabels[fonction]
        }))
});



/**
 *
 * Fetching initial data
 *
 */

json(urls[FINANCE_DATA])
.then(({documentBudgetaires, aggregations}) => {
    store.dispatch({
        type: FINANCE_DATA_RECEIVED,
        documentBudgetaires: documentBudgetaires.map(db => {
            db.rows = new ImmutableSet(db.rows.map(LigneBudgetRecord))
            return DocumentBudgetaire(db)
        }), 
        aggregations
    });

    for(const {Exer} of documentBudgetaires){
        xml(`https://datalocale.github.io/dataviz-finances-gironde/data/finances/plansDeCompte/plan-de-compte-M52-M52-${Exer}.xml`)
        .then(fromXMLDocument)
        .then(planDeCompte => {
            store.dispatch({
                type: PLAN_DE_COMPTE_RECEIVED,
                planDeCompte
            });
        })
    }

});


csv(urls[AGGREGATED_ATEMPORAL])
.then(textList => {
    store.dispatch({
        type: ATEMPORAL_TEXTS_RECEIVED,
        textList
    });
});

csv(urls[AGGREGATED_TEMPORAL])
.then(textList => {
    store.dispatch({
        type: TEMPORAL_TEXTS_RECEIVED,
        textList
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

    const breadcrumb = DEFAULT_BREADCRUMB;
    ReactDOM.render( React.createElement(Breadcrumb, { items: breadcrumb }), BREADCRUMB_CONTAINER );
});


page('/explorer', () => {
    console.log('in route', '/explorer');

    ReactDOM.render(
        React.createElement(
            Provider,
            { store },
            React.createElement(ExploreBudget)
        ),
        CONTAINER_ELEMENT
    );


    const breadcrumb = DEFAULT_BREADCRUMB.push({text: 'Explorer'});
    ReactDOM.render( React.createElement(Breadcrumb, { items: breadcrumb }), BREADCRUMB_CONTAINER );
});


page('/finance-details/:contentId', ({params: {contentId}}) => {
    console.log('in route', '/finance-details', contentId)
    scrollTo(0, 0);

    store.dispatch({
        type: FINANCE_DETAIL_ID_CHANGE,
        financeDetailId: contentId
    })

    ReactDOM.render(
        React.createElement(
            Provider,
            { store },
            React.createElement(FinanceElement)
        ),
        CONTAINER_ELEMENT
    );


    const {docBudgByYear, aggregationByYear, planDeCompteByYear, currentYear, textsById} = store.getState()

    const isM52Element = contentId.startsWith('M52-');

    let RDFI;
    if(isM52Element){
        RDFI = contentId.slice('M52-'.length, 'M52-XX'.length);
    }

    const documentBudgetaire = docBudgByYear.get(currentYear);
    const aggregatedDocumentBudgetaire = aggregationByYear.get(currentYear);
    const planDeCompte = planDeCompteByYear.get(currentYear)

    const hierM52 = documentBudgetaire && RDFI && planDeCompte && hierarchicalM52(documentBudgetaire, planDeCompte, RDFI);

    const childToParent = makeChildToParent(...[aggregatedDocumentBudgetaire, hierM52].filter(x => x !== undefined))

    const breadcrumbData = [];

    let currentElement = (aggregatedDocumentBudgetaire && flattenTree(aggregatedDocumentBudgetaire).find(el => el.id === contentId)) ||
        (hierM52 && flattenTree(hierM52).find(el => el.id === contentId))

    while(currentElement){
        if(currentElement.id !== 'racine'){
            breadcrumbData.push({
                text: textsById.get(currentElement.id).label,
                url: `#!/finance-details/${currentElement.id}`
            })
        }
        currentElement = childToParent.get(currentElement);
    }

    breadcrumbData.push({
        text: 'Explorer',
        url: `#!/explorer`
    })

    const breadcrumb = DEFAULT_BREADCRUMB.concat(breadcrumbData.reverse());

    ReactDOM.render( React.createElement(Breadcrumb, { items: breadcrumb }), BREADCRUMB_CONTAINER );

});

page(`/focus/${SOLIDARITES}`, () => {
    console.log('in route', `/focus/${SOLIDARITES}`);
    scrollTo(0, 0);

    ReactDOM.render(
        React.createElement(
            Provider,
            { store },
            React.createElement(FocusSolidarity)
        ),
        CONTAINER_ELEMENT
    );
});

page(`/focus/${INVEST}`, () => {
    console.log('in route', `/focus/${INVEST}`);
    scrollTo(0, 0);

    ReactDOM.render(
        React.createElement(
            Provider,
            { store },
            React.createElement(FocusInvestments)
        ),
        CONTAINER_ELEMENT
    );
});

page(`/focus/${PRESENCE}`, () => {
    console.log('in route', `/focus/${PRESENCE}`);
    scrollTo(0, 0);

    ReactDOM.render(
        React.createElement(
            Provider,
            { store },
            React.createElement(FocusPresence)
        ),
        CONTAINER_ELEMENT
    );
});

page.redirect(location.pathname, '#!/')
page.redirect(location.pathname+'/', '#!/')

page.base(location.pathname);

page({ hashbang: true });
window.addEventListener('hashchange', () => {
    scrollTo(0, 0);
    page.redirect(location.hash);
});
window.addEventListener('popstate', () => {
    scrollTo(0, 0);
    page.redirect(location.hash);
});
