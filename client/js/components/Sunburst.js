import React from 'react'
import d3Shape from 'd3-shape'

import SunburstSlice from './SunburstSlice'

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
export default function(props){
    const {hierarchicalData, width=800, height=600} = props;

    const children = Array.from(hierarchicalData.children.values());
    
    const pie = d3Shape.pie();
    const arc = d3Shape.arc()
        .innerRadius(RADIUS - DONUT_WIDTH)
        .outerRadius(RADIUS);
    
    const childrenArcDescs = pie(children.map(c => c.total));

    return React.createElement('div', {}, 
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
                            radius: RADIUS, 
                            donutWidth: DONUT_WIDTH, 
                            startAngle: arcDesc.startAngle,
                            endAngle: arcDesc.endAngle
                        }
                    )
                })              
            )
        )
    );
}