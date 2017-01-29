import React from 'react'

import Sunburst from './Sunburst';
import TextualAggregated from './TextualAggregated';
import hierarchicalAggregated from '../finance/hierarchicalAggregated.js';
import {PAR_PUBLIC_VIEW, PAR_PRESTATION_VIEW} from '../finance/constants';

/*

interface AggregatedViZProps{
    M52Instruction: M52Instruction
    aggregatedInstruction : AggregatedInstruction
}

*/
export default function(
    {aggregatedHierarchical, aggregatedSelectedNodes, rdfi, dfView, onSliceSelected, onAggregatedDFViewChange}
    ){
    const rdfiId = rdfi.rd + rdfi.fi;

    return React.createElement('div', {},
        React.createElement('h1', {}, 'Instruction agrégée'),
        (rdfiId === 'DF' ? React.createElement(
            'div', 
            {
                className: 'view-selector',
                onChange: e => {
                    onAggregatedDFViewChange(e.currentTarget.querySelector('input[type="radio"][name="view"]:checked').value)
                }
            },
            React.createElement('label', {}, 
                'Actions par public ',
                React.createElement('input',
                    {name: 'view', value: PAR_PUBLIC_VIEW, type: "radio", defaultChecked: dfView === PAR_PUBLIC_VIEW}
                )
            ),
            React.createElement('label', {}, 
                'Actions par prestation ',
                React.createElement('input',
                    {name: 'view', value: PAR_PRESTATION_VIEW, type: "radio", defaultChecked: dfView === PAR_PRESTATION_VIEW}
                )
            )
        ) : undefined),
        React.createElement(Sunburst, {
            hierarchicalData: aggregatedHierarchical, 
            selectedNodes: aggregatedSelectedNodes,
            donutWidth: 55, outerRadius: 120,
            onSliceSelected
        })
    );
}
