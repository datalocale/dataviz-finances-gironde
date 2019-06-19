import React from 'react';

import Sunburst from './Sunburst';

export default function({
    m52Hierarchical, M52HighlightedNodes, selectedNode,
    donutWidth, outerRadius,
    onSliceOvered, onSliceSelected, width, height,
    }){

    return React.createElement('div', {},
        React.createElement(Sunburst, {
            hierarchicalData: m52Hierarchical,
            highlightedNodes: M52HighlightedNodes, selectedNode,
            donutWidth, outerRadius, padAngle: 1*Math.PI/180,
            onSliceOvered, onSliceSelected,
            width, height,
        })
    );
}
