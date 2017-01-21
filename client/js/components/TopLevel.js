import React from 'react'

import M52Viz from './M52Viz';
import AggregatedViz from './AggregatedViz';
import m52ToAggregated from '../finance/m52ToAggregated.js'

export default function(props){
    const {M52Instruction} = props;
    const aggregatedInstruction = m52ToAggregated(M52Instruction);

    return React.createElement('div', {className: 'top-level'},
        React.createElement(M52Viz, props),
        React.createElement(AggregatedViz, {
            M52Instruction,
            aggregatedInstruction
        })
    );
}