import { createStore } from 'redux'
import React from 'react'
import ReactDOM from 'react-dom'
import {csvParse} from 'd3-dsv' 
import {Record, Set as ImmutableSet, Map as ImmutableMap} from 'immutable'

import afterCSVCleanup from './finance/afterCSVCleanup.js'
import TopLevel from './components/TopLevel.js'

function reducer(state, action){
    const {type} = action;
    
    switch(type){
        case 'M52_DATA_RECEIVED':
            return state.set('M52Data', action.M52)
        default:
            return state; 
    }
}

const M52RowRecord = Record({
    "Département": undefined,
    "Budget": undefined,
    "Type nomenclature": undefined,
    "Exercice": undefined,
    "Type fichier": undefined,
    "Date vote": undefined,
    "Dépense/Recette": undefined,
    "Investissement/Fonctionnement": undefined,
    "Réel/Ordre id/Ordre diff": undefined,
    "Chapitre": undefined,
    "Sous-chapitre": undefined,
    "Opération": undefined,
    "Article": undefined,
    "Rubrique fonctionnelle": undefined,
    "Libellé": undefined,
    "Code devise": undefined,
    "Montant": undefined
})

const CA_P = fetch('./data/cedi_2015_CA.csv')
.then(resp => resp.text())
.then(csvParse)
.then(afterCSVCleanup)
.then(caData => {
    store.dispatch({
        type: 'M52_DATA_RECEIVED',
        M52 : ImmutableSet(
            caData.map(M52RowRecord)
        )
    })
});


const store = createStore(reducer, new ImmutableMap());

store.subscribe( () => {
    const state = store.getState();

    ReactDOM.render(
        React.createElement(
            TopLevel,
            {
                M52Data: state.get('M52Data')
            }
        ),
        document.querySelector('.react-container')
    )


});