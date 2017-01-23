import { createStore } from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';
import {csvParse} from 'd3-dsv';
import {Record, OrderedSet as ImmutableSet, Map as ImmutableMap} from 'immutable';

import hierarchicalM52 from './finance/hierarchicalM52.js';
import afterCSVCleanup from './finance/afterCSVCleanup.js';
import TopLevel from './components/TopLevel.js';
import { computeRowUiState } from './UIFilters.js';

function reducer(state, action){
    const {type} = action;

    switch(type){
    case 'M52_INSTRUCTION_RECEIVED':
        return state.set('M52Instruction', action.M52Instruction);
    case 'M52_INSTRUCTION_USER_HOVERED':
        return state.set('M52Hover', action.M52Rows);
    default:
        return state;
    }
}

const M52RowRecord = Record({
    'Département': undefined,
    'Budget': undefined,
    'Type nomenclature': undefined,
    'Exercice': undefined,
    'Type fichier': undefined,
    'Date vote': undefined,
    'Dépense/Recette': undefined,
    'Investissement/Fonctionnement': undefined,
    'Réel/Ordre id/Ordre diff': undefined,
    'Chapitre': undefined,
    'Sous-chapitre': undefined,
    'Opération': undefined,
    'Article': undefined,
    'Rubrique fonctionnelle': undefined,
    'Libellé': undefined,
    'Code devise': undefined,
    'Montant': undefined
});

fetch('./data/cedi_2015_CA.csv')
    .then(resp => resp.text())
    .then(csvParse)
    .then(afterCSVCleanup)
    .then(caData => {
        const M52Instruction = ImmutableSet(
            caData.map(M52RowRecord)
        );

        store.dispatch({
            type: 'M52_INSTRUCTION_RECEIVED',
            M52Instruction,
        });

        store.dispatch({
            type: 'M52_INSTRUCTION_USER_HOVERED',
            M52Rows: [
                M52Instruction.first()
            ]
        });
    });


const store = createStore(reducer, new ImmutableMap());

const mapStateToProps = (state) => {
    const M52Instruction = state.get('M52Instruction');
    const M52Hierarchical = hierarchicalM52(M52Instruction);
    // const M52RowsUIState = computeRowUiState(M52Hierarchical, state.get('M52Hover'));

    return {
        M52Instruction,
        M52Hierarchical,
        M52RowsUIState: {}
    };
};

store.subscribe( () => {
    const state = store.getState();

    ReactDOM.render(
        React.createElement(
            TopLevel,
            mapStateToProps(state)
        ),
        document.querySelector('.react-container')
    );


});
