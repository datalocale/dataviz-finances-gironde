import React from 'react'
<<<<<<< 8fa1805a8cf4efc5f8db4d384e5452f6cfccd6c9

import Sunburst from './Sunburst';
=======
import Sunburst from './Sunburst';
import TextualAggregated from './TextualAggregated';

>>>>>>> Affichage d'un sunburst pour la vue agrégée
import hierarchicalAggregated from '../finance/hierarchicalAggregated.js';

/*

interface AggregatedViZProps{
    M52Instruction: M52Instruction
    aggregatedInstruction : AggregatedInstruction
}

*/
<<<<<<< 8fa1805a8cf4efc5f8db4d384e5452f6cfccd6c9
export default function({aggregatedHierarchical, aggregatedSelectedNodes, onSliceSelected}){
    return React.createElement('div', {},
        React.createElement('h1', {}, aggregatedHierarchical.name),
        React.createElement(Sunburst, {
            hierarchicalData: aggregatedHierarchical, 
            selectedNodes: aggregatedSelectedNodes,
            onSliceSelected
        })
=======
export default function(props){
    const {aggregatedInstruction, M52Instruction} = props;
    //const hierarchicalData = hierarchicalAggregated(aggregatedInstruction);

    //console.log('hierarchicalData', hierarchicalData);

    return React.createElement('div', {},
        // TODO : this shouldn't be just a sunburst but rather the choice of "par prestation" or "par public" should be offered
        //React.createElement(Sunburst, { hierarchicalData }),
        React.createElement(TextualAggregated, props)
>>>>>>> Affichage d'un sunburst pour la vue agrégée
    );
}