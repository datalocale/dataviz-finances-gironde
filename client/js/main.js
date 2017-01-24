import { createStore } from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';
import {csvParse} from 'd3-dsv';
import {Record, OrderedSet as ImmutableSet, Map as ImmutableMap} from 'immutable';
import memoize from 'lodash.memoize';

import hierarchicalM52 from './finance/hierarchicalM52.js';
import hierarchicalAggregated from './finance/hierarchicalAggregated.js';
import m52ToAggregated from './finance/m52ToAggregated.js';
import afterCSVCleanup from './finance/afterCSVCleanup.js';

import TopLevel from './components/TopLevel.js';


function reducer(state, action){
    const {type} = action;

    switch(type){
    case 'M52_INSTRUCTION_RECEIVED':
        return state.set('M52Instruction', action.M52Instruction);
    case 'M52_INSTRUCTION_USER_NODE_SELECTED':
        return state
            .set('M52NodeSelected', action.M52Node)
            .set('aggregatedNodeSelected', undefined);
    case 'AGGREGATED_INSTRUCTION_USER_NODE_SELECTED':
        return state
            .set('M52NodeSelected', undefined)
            .set('aggregatedNodeSelected', action.aggregatedNode);
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

function findSelectedAggregatedNodesByM52Rows(aggregatedNode, m52Rows){
    let result = new ImmutableSet();

    if(m52Rows.some(row => {
        return Array.from(aggregatedNode.elements).some(el => el["M52Rows"].has(row))
    })){
        result = result.add(aggregatedNode);
    }
    
    if(aggregatedNode.children){
        Array.from(aggregatedNode.children.values()).forEach(child => {
            const selectedNodes = findSelectedAggregatedNodesByM52Rows(child, m52Rows);
            result = result.union(selectedNodes);
        })
    }

    return result;
}

function findSelectedM52NodesByM52Rows(M52Node, m52Rows){
    let result = new ImmutableSet();

    if(m52Rows.some(row => M52Node.elements.has(row))){
        result = result.add(M52Node);
    }
    
    if(M52Node.children){
        Array.from(M52Node.children.values()).forEach(child => {
            const selectedNodes = findSelectedM52NodesByM52Rows(child, m52Rows);
            result = result.union(selectedNodes);
        })
    }

    return result;
}


const memoizedHierarchicalM52 = memoize(hierarchicalM52);
const memoizedHierarchicalAggregated = memoize(hierarchicalAggregated);
const memoizedM52ToAggregated = memoize(m52ToAggregated);

function mapStateToProps(state){
    const M52Instruction = state.get('M52Instruction');
    const aggregatedInstruction = memoizedM52ToAggregated(M52Instruction);
    
    const M52Hierarchical = memoizedHierarchicalM52(M52Instruction);
    const aggregatedHierarchical = memoizedHierarchicalAggregated(aggregatedInstruction);
    
    let M52SelectedNodes;
    let aggregatedSelectedNodes;

    const M52SelectedNode = state.get('M52NodeSelected');
    const aggregatedSelectedNode = state.get('aggregatedNodeSelected');
    if(M52SelectedNode){
        M52SelectedNodes = findSelectedNodeAncestors(M52Hierarchical, M52SelectedNode);
        aggregatedSelectedNodes = findSelectedAggregatedNodesByM52Rows(aggregatedHierarchical, Array.from(M52SelectedNode.elements))
    }
    if(aggregatedSelectedNode){
        aggregatedSelectedNodes = findSelectedNodeAncestors(aggregatedHierarchical, aggregatedSelectedNode);
        let m52Rows = new ImmutableSet();
        aggregatedSelectedNode.elements.forEach(e => m52Rows = m52Rows.union(e["M52Rows"]));

        M52SelectedNodes = findSelectedM52NodesByM52Rows(M52Hierarchical, m52Rows);
    }

    return {
        M52Instruction,
        aggregatedInstruction,
        M52Hierarchical,
        M52SelectedNodes,
        aggregatedHierarchical,
        aggregatedSelectedNodes
    };
};

function mapDispatchToProps(dispatch){
    return {
        onM52NodeSelected(node){
            store.dispatch({
                type: 'M52_INSTRUCTION_USER_NODE_SELECTED',
                M52Node: node
            });
        },
        onAggregatedNodeSelected(node){
            console.log('onAggregatedNodeSelected', node);

            store.dispatch({
                type: 'AGGREGATED_INSTRUCTION_USER_NODE_SELECTED',
                aggregatedNode: node
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
