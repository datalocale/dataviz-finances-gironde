import React from 'react'

import M52Viz from './M52Viz';
import AggregatedViz from './AggregatedViz';
import TextualAggregated from './TextualAggregated';
import TextualSelected from './TextualSelected';
import m52ToAggregated from '../finance/m52ToAggregated.js'

export default function({
        M52Instruction, aggregatedInstruction,
        M52Hierarchical, M52SelectedNodes,
        aggregatedHierarchical, aggregatedSelectedNodes,
        M52SelectedNode, aggregatedSelectedNode,
        onM52NodeSelected, onAggregatedNodeSelected
    }){

    return M52Instruction ? React.createElement('div', {className: 'top-level'},
        React.createElement('div', {},
            React.createElement(M52Viz, {
                M52Hierarchical, M52SelectedNodes,
                onSliceSelected: onM52NodeSelected
            }),
            React.createElement(AggregatedViz, {
                aggregatedHierarchical, aggregatedSelectedNodes,
                onSliceSelected: onAggregatedNodeSelected
            })
        )/*,
        M52SelectedNode || aggregatedSelectedNode ? 
            React.createElement(TextualSelected, {M52SelectedNode, aggregatedSelectedNode}) :
            undefined,
        React.createElement(TextualAggregated, {M52Instruction, aggregatedInstruction})*/
    ) : React.createElement('div', {});
}
