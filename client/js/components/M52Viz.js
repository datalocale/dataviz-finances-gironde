import React from 'react'
import Sunburst from './Sunburst';

import hierarchicalM52 from '../finance/hierarchicalM52.js';

export default function(props){


    return React.createElement(Sunburst, {
        hierarchicalData: hierarchicalM52(props.M52Data)
    })
}