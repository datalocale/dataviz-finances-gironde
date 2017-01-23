import React from 'react'
import Sunburst from './Sunburst';


/*

interface M52VizProps{
    M52Hierarchical: M52Hierarchical
}

 */
export default function(props){
    const { M52Hierarchical } = props;

    return React.createElement('div', {},
        React.createElement('h1', {}, M52Hierarchical.name),
        React.createElement(Sunburst, { hierarchicalData: M52Hierarchical })
    );
}
