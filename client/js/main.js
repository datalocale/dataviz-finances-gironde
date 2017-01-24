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
    case 'M52_INSTRUCTION_USER_NODE_HOVERED':
        return state.set('M52NodeHover', action.M52Node);
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

    });


const store = createStore(reducer, new ImmutableMap());


const m52InstructionToHierarchical = new WeakMap();
function memoizedHierarchicalM52(instr){
    let hier = m52InstructionToHierarchical.get(instr);
    if(!hier){
        hier = hierarchicalM52(instr);
        m52InstructionToHierarchical.set(instr, hier);
    }
    return hier;
}


let childToParent;

function findSelectedNodeAncestors(tree, selectedNode){
    if(!selectedNode)
        return undefined;

    if(!childToParent)
        childToParent = new WeakMap();

    if(tree === selectedNode){
        let result = [];
        let current = selectedNode;
        while(current !== undefined){
            result.push(current);
            current = childToParent.get(current);
        }
        return new ImmutableSet(result);
    }
    
    let ret;

    if(tree.children){
        Array.from(tree.children.values()).forEach(child => {
            childToParent.set(child, tree);
            const ancestors = findSelectedNodeAncestors(child, selectedNode);
            if(ancestors)
                ret = ancestors;
        })
    }

    return ret;
}

    

function mapStateToProps(state){
    const M52Instruction = state.get('M52Instruction');
    const M52Hierarchical = memoizedHierarchicalM52(M52Instruction);
    // const M52RowsUIState = computeRowUiState(M52Hierarchical, state.get('M52Hover'));


    return {
        M52Instruction,
        M52Hierarchical,
        M52SelectedNodes: findSelectedNodeAncestors(M52Hierarchical, state.get('M52NodeHover'))
    };
};

function mapDispatchToProps(dispatch){
    return {
        onSliceSelected(node){
            console.log('onSliceSelected', node);

            store.dispatch({
                type: 'M52_INSTRUCTION_USER_NODE_HOVERED',
                M52Node: node
            });
        }
    }
}



store.subscribe( () => {
    const state = store.getState();

    ReactDOM.render(
        React.createElement(
            TopLevel,
            Object.assign({}, mapStateToProps(state), mapDispatchToProps(store.dispatch))
        ),
        document.querySelector('.react-container')
    );


});
