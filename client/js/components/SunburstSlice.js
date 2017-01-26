import React from 'react'
import d3Shape from 'd3-shape'

import {flattenTree} from '../finance/visitHierarchical.js';

export default class SunburstSlice extends React.Component{
    
    shouldComponentUpdate(nextProps){
        if(['radius', 'donutWidth', 'startAngle', 'endAngle']
            .some(k => this.props[k] !== nextProps[k]))
            return true;

        if(this.props.node !== nextProps.node)
            return true;
        // from now on, this.props.node === nextProps.node
        const node = nextProps.node;

        if(this.props.selectedNodes === nextProps.selectedNodes)
            return false;
        else{
            if(!this.props.selectedNodes || !nextProps.selectedNodes)
                return true;
            
            const nodes = flattenTree(node);
            
            // update the component if there is a difference in this.props.selectedNodes VS nextProps.selectedNodes
            // in regard to the node being drawn
            return nodes.some(n => this.props.selectedNodes.has(n) !== nextProps.selectedNodes.has(n))
        }

    }

    render(){
        const {
            node, radius, donutWidth, startAngle, endAngle,
            selectedNodes,
            onSliceSelected
        } = this.props;
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

        const selected = selectedNodes && selectedNodes.has(node);

        return React.createElement(
            'g', 
            { 
                className: [
                    'slice',
                    selected ? 'selected' : undefined
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
                selected ? React.createElement('text', {
                    transform: 'translate('+arc.centroid(parentArcDesc)+')',
                    style: {
                        textAnchor: 'middle',
                        fill: '#111'
                    },
                    dy: '.35em'
                }, name) : undefined
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
}
