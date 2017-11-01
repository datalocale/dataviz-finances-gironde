import React from 'react';
import {pie as d3pie} from 'd3-shape';

import SunburstSlice from './SunburstSlice';

const DONUT_WIDTH = 45;
const RADIUS = 80;

/*

interface SunburstProps<Element>{
    hierarchicalData: HierarchicalData<Element>
    width: number
    height: number
}

// This data structure contains computed fields, but it's ~fine because it's 
// only meant to be read once for viz  
interface HierarchicalData<Element>{
    children: Map<category, Set<HierarchicalData<Element>>>
    id: string // unique id across the data structure
    name: string
    ownValue: number
    total: number // computed value

    // elements composing the slice
    elements: Set<Element>
}

*/
export default function({
        hierarchicalData, width, height, 
        highlightedNodes, selectedNode,
        donutWidth, outerRadius, padAngle = 0,
        onSliceOvered, onSliceSelected
    }){

    width = width || 2*outerRadius + 30;
    height = height || 2*outerRadius + 30;

    donutWidth = donutWidth || DONUT_WIDTH;
    outerRadius = outerRadius || RADIUS;

    const children = Array.from(hierarchicalData.children.values());
    
    const pie = d3pie();
    
    const childrenArcDescs = pie(children.map(c => c.total));

    return React.createElement(
        'div',
        {
            className: [
                'sunburst',
                highlightedNodes ? 'active-selection' : undefined
            ].filter(s => s).join(' '),
            onMouseOver: onSliceOvered ? e => {
                if(!e.target.matches('.slice *')){
                    onSliceOvered(undefined);
                }
            } : undefined,
            onClick: onSliceSelected ? e => {
                if(!e.target.matches('.slice *')){
                    onSliceSelected(undefined);
                }
            } : undefined
        },
        React.createElement('svg', {width: width, height: height},
            React.createElement(
                'g', 
                {transform: 'translate('+width/2+','+height/2+')'},
                children.map((child, i) => {
                    const arcDesc = childrenArcDescs[i];

                    return React.createElement(
                        SunburstSlice,
                        {
                            key: child.name,
                            node: child, 
                            radius: outerRadius, 
                            donutWidth, 
                            startAngle: arcDesc.startAngle,
                            endAngle: arcDesc.endAngle,
                            padAngle,
                            highlightedNodes,
                            selectedNode,
                            onSliceOvered,
                            onSliceSelected
                        }
                    );
                })              
            )
        )
    );
}
