import React from 'react'
import Sunburst from './Sunburst';
import TextualAggregated from './TextualAggregated';

import hierarchicalAggregated from '../finance/hierarchicalAggregated.js';

/*

interface AggregatedViZProps{
    M52Instruction: M52Instruction
    aggregatedInstruction : AggregatedInstruction
}

*/
export default function(props){
    const {aggregatedInstruction, M52Instruction} = props;
    //const hierarchicalData = hierarchicalAggregated(aggregatedInstruction);

    //console.log('hierarchicalData', hierarchicalData);

    return React.createElement('div', {},
        // TODO : this shouldn't be just a sunburst but rather the choice of "par prestation" or "par public" should be offered
        //React.createElement(Sunburst, { hierarchicalData }),
        React.createElement(TextualAggregated, props)
    );
}