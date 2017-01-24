import React from 'react'

import M52Viz from './M52Viz';
import AggregatedViz from './AggregatedViz';
import TextualAggregated from './TextualAggregated';
import m52ToAggregated from '../finance/m52ToAggregated.js'


export default function({
        M52Instruction, M52Hierarchical, 
        M52SelectedNodes, 
        onSliceSelected
    }){
    const aggregatedInstruction = m52ToAggregated(M52Instruction);

    return React.createElement('div', {className: 'top-level'},
        React.createElement('div', {},
            React.createElement(M52Viz, {
                M52Instruction, 
                M52Hierarchical, 
                M52SelectedNodes,
                onSliceSelected
            })/*,
            React.createElement(AggregatedViz, {
                M52Instruction,
                aggregatedInstruction,
                onSliceSelected
            })*/
        )/*,
        React.createElement(TextualAggregated, {M52Instruction, aggregatedInstruction})
        */
    );
}
