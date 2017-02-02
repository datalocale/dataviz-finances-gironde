import React from 'react'
import Sunburst from './Sunburst';

/*

interface M52VizProps{
    M52Hierarchical: M52Hierarchical
}

 */

export default function({ M52Hierarchical, M52HighlightedNodes, onSliceOvered }){
    return React.createElement('div', {},
        React.createElement('h1', {}, "Instruction M52"),
        React.createElement(Sunburst, { hierarchicalData: M52Hierarchical, highlightedNodes: M52HighlightedNodes, onSliceOvered })
    );
}
