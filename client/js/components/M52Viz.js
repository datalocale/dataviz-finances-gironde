import React from 'react'
import Sunburst from './Sunburst';

/*

<<<<<<< 8fa1805a8cf4efc5f8db4d384e5452f6cfccd6c9
interface M52VizProps{
    M52Hierarchical: M52Hierarchical
}

 */

export default function({ M52Hierarchical, M52SelectedNodes, onSliceSelected }){
=======
/*

interface M52VizProps{
    M52Instruction: M52Instruction
}

 */
export default function(props){
    const hierarchicalData = hierarchicalM52(props.M52Instruction);
>>>>>>> Affichage d'un sunburst pour la vue agrégée

    return React.createElement('div', {},
        React.createElement('h1', {}, M52Hierarchical.name),
        React.createElement(Sunburst, { hierarchicalData: M52Hierarchical, selectedNodes: M52SelectedNodes, onSliceSelected })
    );
}