import React from 'react'
import d3Shape from 'd3-shape'

export default function SunburstSlice(props){
    const {
        node, radius, donutWidth, startAngle, endAngle,
        selectedNodes,
        onSliceSelected
    } = props;
    const {name} = node;

    const children = node.children ? Array.from(node.children.values()) : [];
    
    const pie = d3Shape.pie()
        .startAngle(startAngle)
        .endAngle(endAngle);
    const arc = d3Shape.arc()
        .innerRadius(radius - donutWidth)
        .outerRadius(radius);
    
    const childrenArcDescs = pie(children.map(c => c.total));
    const parentArcDesc = { startAngle, endAngle };

    return React.createElement(
        'g', 
        { 
            className: [
                'slice',
                selectedNodes && selectedNodes.has(node) ? 'selected' : undefined,
                selectedNodes && selectedNodes.last() === node ? 'last' : undefined
            ].filter(s => s).join(' ')
        },
        React.createElement(
            'g', 
            {
                className: 'piece',
                onMouseOver(e){
                    onSliceSelected(node);
                }
            },
            React.createElement('path', {
                d: arc(parentArcDesc)
            }),
            React.createElement('text', {
                transform: 'translate('+arc.centroid(parentArcDesc)+')',
                style: {
                    textAnchor: 'middle',
                    fill: '#111'
                },
                dy: '.35em'
            }, name)
        ),
        children.map((child, i) => {
            const arcDesc = childrenArcDescs[i];
    
            return React.createElement( 
                SunburstSlice, // yep recursive call
                {
                    key: child.name,
                    node: child, 
                    radius: radius + donutWidth, 
                    donutWidth, 
                    startAngle: arcDesc.startAngle, 
                    endAngle: arcDesc.endAngle,
                    selectedNodes,
                    onSliceSelected
                }
            )
        })  
    );
}
