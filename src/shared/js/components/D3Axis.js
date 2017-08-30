import React from 'react';

export default function D3Axis({
    tickData, className, onSelectedAxisItem
}){
    return React.createElement('g', {className: ['d3-axis', className].filter(x => x).join(' ')}, 
        tickData.map(({id, transform, line: {x1, y1, x2, y2}, text: {x, y, dx, dy, anchor='middle', t}, className: tickClass }, i) => {
            return React.createElement('g', {
                key: i,
                className: ['tick', tickClass, onSelectedAxisItem ? 'actionable' : undefined].filter(x=>x).join(' '), 
                transform, 
                onClick(){
                    onSelectedAxisItem(id)
                }}, 
                React.createElement('line', {x1, y1, x2, y2}),
                React.createElement('text', {x, y, dx, dy, textAnchor: anchor}, t)
            )
        })
    )
}
