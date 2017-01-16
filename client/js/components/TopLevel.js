import React from 'react'

import M52Viz from './M52Viz';
import TextualAggregated from './TextualAggregated';
import m52ToAgrégée from '../finance/m52ToAgrégée.js'

export default function(props){
    const {M52Instruction} = props;
    const aggregatedInstruction = m52ToAgrégée(M52Instruction);

    console.log('agg', aggregatedInstruction.toJS());

    return React.createElement('div', {},
        React.createElement(M52Viz, props),
        React.createElement(TextualAggregated, {
            M52Instruction,
            aggregatedInstruction
        })
    );
}