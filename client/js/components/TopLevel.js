import React from 'react'

import M52Viz from './M52Viz';
import AggregatedViz from './AggregatedViz';
<<<<<<< 8fa1805a8cf4efc5f8db4d384e5452f6cfccd6c9
import TextualAggregated from './TextualAggregated';
=======
>>>>>>> Affichage d'un sunburst pour la vue agrégée
import m52ToAggregated from '../finance/m52ToAggregated.js'


<<<<<<< 8fa1805a8cf4efc5f8db4d384e5452f6cfccd6c9
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
=======
    return React.createElement('div', {className: 'top-level'},
        React.createElement(M52Viz, props),
        React.createElement(AggregatedViz, {
>>>>>>> Affichage d'un sunburst pour la vue agrégée
            M52Instruction,
            aggregatedInstruction
        })
    );
}
