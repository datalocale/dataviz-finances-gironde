import React from 'react'

import M52Viz from './M52Viz';
import AggregatedViz from './AggregatedViz';
import TextualAggregated from './TextualAggregated';
import TextualSelected from './TextualSelected';
import RDFISelector from './RDFISelector';

import m52ToAggregated from '../finance/m52ToAggregated.js';

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
        over,
        onM52NodeOvered, onAggregatedNodeOvered, 
        onRDFIChange, onAggregatedDFViewChange
    }){

    return M52Instruction ? React.createElement('div', {className: 'top-level'},
        React.createElement('div', {},
            React.createElement(M52Viz, {
                M52Hierarchical, M52HighlightedNodes,
                onSliceOvered: onM52NodeOvered
            }),
            React.createElement(RDFISelector, { rdfi, onRDFIChange }),
            React.createElement(AggregatedViz, {
                aggregatedHierarchical, aggregatedHighlightedNodes,
                rdfi, dfView,
                onSliceOvered: onAggregatedNodeOvered,
                onAggregatedDFViewChange
            })
        ),
        over ? React.createElement(TextualSelected, {over}) : undefined,
        React.createElement(TextualAggregated, {M52Instruction, aggregatedInstruction})
    ) : React.createElement('div', {});
}
