import React from 'react'

import M52Viz from './M52Viz';
import AggregatedViz from './AggregatedViz';
import TextualAggregated from './TextualAggregated';
import m52ToAggregated from '../finance/m52ToAggregated.js'


export default function(props){
    const {M52Instruction, M52Hierarchical} = props;
    const aggregatedInstruction = m52ToAggregated(M52Instruction);

    console.log('agg', aggregatedInstruction.toJS())

    return React.createElement('div', {className: 'top-level'},
        React.createElement('div', {},
            React.createElement(M52Viz, props),
            React.createElement(AggregatedViz, {
                M52Instruction,
                aggregatedInstruction
            })
        ),
        React.createElement(TextualAggregated, {M52Instruction, aggregatedInstruction})
    );
}
