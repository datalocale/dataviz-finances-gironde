import React from 'react'

import Sunburst from '../../../shared/js/components/Sunburst';
import {PAR_PUBLIC_VIEW, PAR_PRESTATION_VIEW} from '../../../shared/js/finance/constants';

/*

interface AggregatedViZProps{
    M52Instruction: M52Instruction
    aggregatedInstruction : AggregatedInstruction
}

*/
export default function({
    aggregatedHierarchical, aggregatedHighlightedNodes, selectedNode,
    rdfi, dfView,
    onSliceOvered, onSliceSelected, onAggregatedDFViewChange,
    width, height,
    }){

    return React.createElement('div', {},
        React.createElement('h1', {}, 'Instruction agrégée'),
        (rdfi === 'DF' ? React.createElement(
            'div',
            {
                className: 'view-selector',
                onClick: e => {
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
            highlightedNodes: aggregatedHighlightedNodes, selectedNode,
            donutWidth: 55, outerRadius: 120,
            onSliceOvered, onSliceSelected,
            height, width
        })
    );
}
