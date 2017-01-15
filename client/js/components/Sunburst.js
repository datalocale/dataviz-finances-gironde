import React from 'react'
import d3Shape from 'd3-shape'

import HierarchicSlice from './HierarchicSlice'

const DONUT_WIDTH = 45;
const RADIUS = 80;

export default function(props){
    const {hierarchicalData, width=800, height=600} = props;

    const children = Array.from(hierarchicalData.children.values());
    
    const pie = d3Shape.pie();
    const arc = d3Shape.arc()
        .innerRadius(RADIUS - DONUT_WIDTH)
        .outerRadius(RADIUS);
    
    const childrenArcDescs = pie(children.map(c => c.total));

    return React.createElement('div', {}, 
        React.createElement('h1', {}, hierarchicalData.name),
        React.createElement('h2', {}, hierarchicalData.total),
        React.createElement('svg', {width: width, height: height},
            React.createElement(
                'g', 
                {transform: 'translate('+width/2+','+height/2+')'},
                children.map((child, i) => {
                    const arcDesc = childrenArcDescs[i];
                    console.log('arcDesc',arcDesc,  child, i);

                    return React.createElement(
                        HierarchicSlice,
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
