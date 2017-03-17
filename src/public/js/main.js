import { createStore } from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import { Record, List } from 'immutable';

import reducer from './reducer';
import stateToProps from './stateToProps';
import dispatchToProps from './dispatchToProps';

import csvStringToM52Instructions from '../../shared/js/finance/csvStringToM52Instructions.js';

import TopLevel from './components/TopLevel';

import {HOME} from './constants/pages';


const REACT_CONTAINER_SELECTOR = '.content';

const StoreRecord = Record({
    m52Instruction: undefined,
    breadcrumb: undefined
});

const store = createStore(
    reducer,
    new StoreRecord({
        breadcrumb: new List([HOME])
    })
);

const BoundTopLevel = connect(
    stateToProps,
    dispatchToProps
)(TopLevel);


fetch('./data/cedi_2015_CA.csv').then(resp => resp.text())
    .then(csvStringToM52Instructions)
    .then(m52Instruction => {
        store.dispatch({
            type: 'M52_INSTRUCTION_RECEIVED',
            m52Instruction,
        });
    });

ReactDOM.render(
    React.createElement(
        Provider,
        { store },
        React.createElement(BoundTopLevel)
    ),
    document.querySelector(REACT_CONTAINER_SELECTOR)
);
