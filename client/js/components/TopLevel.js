import React from 'react'

import M52Viz from './M52Viz';
import AggregatedViz from './AggregatedViz';
import TextualAggregated from './TextualAggregated';
import TextualSelected from './TextualSelected';
import RDFISelector from './RDFISelector';

import m52ToAggregated from '../finance/m52ToAggregated.js';
import {M52_INSTRUCTION, AGGREGATED_INSTRUCTION} from '../finance/constants';

/*
        rdfi, dfView,
        M52Instruction, aggregatedInstruction,
        M52Hierarchical, M52OveredNodes,
        aggregatedHierarchical, aggregatedOveredNodes,
        over

 */

export default function({
        rdfi, dfView,
        M52Instruction, aggregatedInstruction,
        M52Hierarchical, M52HighlightedNodes,
        aggregatedHierarchical, aggregatedHighlightedNodes,
        over, selectedNode,
        onM52NodeOvered, onAggregatedNodeOvered, 
        onM52NodeSelected, onAggregatedNodeSelected,
        onRDFIChange, onAggregatedDFViewChange
    }){

    return M52Instruction ? React.createElement('div', {className: 'top-level'},
        React.createElement('div', {},
            React.createElement(M52Viz, {
                M52Hierarchical, 
                M52HighlightedNodes,
                selectedNode: selectedNode && selectedNode.type === M52_INSTRUCTION ? selectedNode.node : undefined,
                onSliceOvered: onM52NodeOvered,
                onSliceSelected: onM52NodeSelected
            }),
            React.createElement(RDFISelector, { rdfi, onRDFIChange }),
            React.createElement(AggregatedViz, {
                aggregatedHierarchical, 
                aggregatedHighlightedNodes,
                selectedNode: selectedNode && selectedNode.type === AGGREGATED_INSTRUCTION ? selectedNode.node : undefined,
                rdfi, dfView,
                onSliceOvered: onAggregatedNodeOvered,
                onSliceSelected: onAggregatedNodeSelected,
                onAggregatedDFViewChange
            })
        ),
        over ? React.createElement(TextualSelected, {over}) : undefined,
        React.createElement(TextualAggregated, {M52Instruction, aggregatedInstruction})
    ) : React.createElement('div', {});
}
