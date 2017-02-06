import React from 'react'
import d3Shape from 'd3-shape'

import {flattenTree} from '../finance/visitHierarchical.js';

export default class SunburstSlice extends React.Component{
    
    shouldComponentUpdate(nextProps){
        if(['radius', 'donutWidth', 'startAngle', 'endAngle', 'selectedNode']
            .some(k => this.props[k] !== nextProps[k]))
            return true;

        if(this.props.node !== nextProps.node)
            return true;
        // from now on, this.props.node === nextProps.node
        const node = nextProps.node;

        if(this.props.highlightedNodes === nextProps.highlightedNodes)
            return false;
        else{
            if(!this.props.highlightedNodes || !nextProps.highlightedNodes)
                return true;
            
            const nodes = flattenTree(node);
            
            // update the component if there is a difference in this.props.highlightedNodes VS nextProps.highlightedNodes
            // in regard to the node being drawn
            return nodes.some(n => this.props.highlightedNodes.has(n) !== nextProps.highlightedNodes.has(n))
        }

    }

    render(){
        const {
            node, radius, donutWidth, startAngle, endAngle,
            highlightedNodes, selectedNode,
            onSliceOvered, onSliceSelected
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

        const highlighted = highlightedNodes && highlightedNodes.has(node);
        const selected = selectedNode === node;

        return React.createElement(
            'g', 
            { 
                className: [
                    'slice',
                    highlighted ? 'highlighted' : undefined,
                    selected ? 'selected' : undefined
                ].filter(s => s).join(' ')
            },
            React.createElement(
                'g', 
                {
                    className: 'piece',
                    onMouseOver(e){
                        onSliceOvered(node);
                    },
                    onClick(e){
                        onSliceSelected(node);
                    }
                },
                React.createElement('path', {
                    d: arc(parentArcDesc)
                }),
                highlighted ? React.createElement('text', {
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
                        highlightedNodes, selectedNode, 
                        onSliceOvered, onSliceSelected
                    }
                )
            })  
        );
    }
}
