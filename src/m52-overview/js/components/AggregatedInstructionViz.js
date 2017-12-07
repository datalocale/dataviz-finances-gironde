import React from 'react'
import Sunburst from './Sunburst';

import hierarchicalM52 from '../finance/hierarchicalM52.js';

export default function(props){
    const hierarchicalData = hierarchicalM52(props.M52Instruction);

    return React.createElement('div', {},
        React.createElement('h1', {}, hierarchicalData.name),
        React.createElement('h2', {}, hierarchicalData.total.toFixed(2)),
        React.createElement(Sunburst, { hierarchicalData })
    );
}
