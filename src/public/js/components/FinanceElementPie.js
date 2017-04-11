import React from 'react';
import {arc as _arc, pie as _pie} from 'd3-shape';

export default function({
        width = 200, height = 200,
        radius = 100,
        parentProportion,
        elementProportion
    }){
    
    const data = parentProportion ? 
        [elementProportion, parentProportion-elementProportion, 1-parentProportion] :
        [elementProportion, 1-elementProportion];

    const pie = _pie()
        .sort((x, y) => data.findIndex(e => e === y) - data.findIndex(e => e === x))
        .startAngle(0)
        .endAngle(-2*Math.PI);
    const arc = _arc();
    
    const arcDescs = pie(data);

    return React.createElement('svg', {width, height, className: 'finance-element-pie'},
        React.createElement(
            'g', 
            {transform: `translate(${width/2}, ${height/2})`},
            arcDescs.map(ad => {
                const d = arc(Object.assign(
                    { outerRadius: radius, innerRadius: 0 },
                    ad
                ))

                return React.createElement('g', {className: 'arc'},
                    React.createElement('path', {d})
                )
            })
        )
    );
}
