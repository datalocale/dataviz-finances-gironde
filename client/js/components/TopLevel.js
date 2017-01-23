import React from 'react'

import M52Viz from './M52Viz';
import AggregatedViz from './AggregatedViz';
import TextualAggregated from './TextualAggregated';
import m52ToAggregated from '../finance/m52ToAggregated.js'

export default function({
        M52Hierarchical, M52SelectedNodes,
        aggregatedHierarchical, aggregatedSelectedNodes,
        onM52NodeSelected, onAggregatedNodeSelected
    }){

    return React.createElement('div', {className: 'top-level'},
        React.createElement('div', {},
            React.createElement(M52Viz, {
                M52Hierarchical, M52SelectedNodes,
                onSliceSelected: onM52NodeSelected
            }),
            React.createElement(AggregatedViz, {
                aggregatedHierarchical, aggregatedSelectedNodes,
                onSliceSelected: onAggregatedNodeSelected
            })
        ),
        React.createElement(TextualAggregated, {
            M52Instruction,
            aggregatedInstruction
        })
    );
}
