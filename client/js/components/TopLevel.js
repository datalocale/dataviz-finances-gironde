import React from 'react'

import M52Viz from './M52Viz';
import AggregatedViz from './AggregatedViz';
import TextualAggregated from './TextualAggregated';
import TextualSelected from './TextualSelected';
import RDFISelector from './RDFISelector';

import m52ToAggregated from '../finance/m52ToAggregated.js';

export default function({
        rdfi, dfView,
        M52Instruction, aggregatedInstruction,
        M52Hierarchical, M52SelectedNodes,
        aggregatedHierarchical, aggregatedSelectedNodes,
        M52SelectedNode, aggregatedSelectedNode,
        onM52NodeSelected, onAggregatedNodeSelected, 
        onRDFIChange, onAggregatedDFViewChange
    }){

    return M52Instruction ? React.createElement('div', {className: 'top-level'},
        React.createElement('div', {},
            React.createElement(M52Viz, {
                M52Hierarchical, M52SelectedNodes,
                onSliceSelected: onM52NodeSelected
            }),
            React.createElement(RDFISelector, { rdfi, onRDFIChange }),
            React.createElement(AggregatedViz, {
                aggregatedHierarchical, aggregatedSelectedNodes,
                rdfi, dfView,
                onSliceSelected: onAggregatedNodeSelected,
                onAggregatedDFViewChange
            })
        ),
        M52SelectedNode || aggregatedSelectedNode ? 
            React.createElement(TextualSelected, {M52SelectedNode, aggregatedSelectedNode}) :
            undefined,
        React.createElement(TextualAggregated, {M52Instruction, aggregatedInstruction})
    ) : React.createElement('div', {});
}
