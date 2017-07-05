import React from 'react';
import {arc as _arc, pie as _pie} from 'd3-shape';

/*

interface DonutProps{
    proportion: number [0, 1]
    innerText: string
    width: number
    height: number
}

*/
export default function({
        width = 400, height = 400,
        donutWidth = 50, outerRadius = 200,
        padAngle = Math.PI/30,
        proportion,
        innerText
    }){
    
    const pie = _pie()
        .startAngle(2*Math.PI)
        .endAngle(0)
        .padAngle(padAngle)
        .sort( (x, y) => x === proportion ? -1 : 1);
    const arc = _arc();

    const data = [proportion, 1-proportion];
    const arcDescs = pie(data);

    return React.createElement('div', {className: 'focus-donut'},
        React.createElement('svg', {width, height},
            React.createElement(
                'g', 
                {transform: `translate(${width/2}, ${height/2})`},
                arcDescs.map(ad => {
                    const d = arc(Object.assign(
                        {
                            outerRadius,
                            innerRadius: outerRadius - donutWidth
                        },
                        ad
                    ))

                    return React.createElement('g', {className: ['arc', ad.data === proportion ? 'highlighted' : ''].join(' ')},
                        React.createElement('path', {d})
                    )
                }),
                proportion ? React.createElement('g', {},
                    React.createElement('text', {className: 'percentage', textAnchor: 'middle', dy: "0.1em"}, 
                        React.createElement('tspan', {className: 'percent', textAnchor: 'middle'}, Math.round(100*proportion)),
                        React.createElement('tspan', {textAnchor: 'middle', style: {fontWeight: '100'}}, '%')
                    ),
                    innerText.map((t, i) => {
                        return React.createElement('text', {textAnchor: 'middle', dy: (i*1+2.5)+"em"}, t)
                    })
                ) : undefined

            )
        )
    );
    
}
