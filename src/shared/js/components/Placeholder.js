import React from 'react';

/*
    This component is meant to denote a place that should be filled with something else later.
    It helps prototyping and better project the final layout and visual of what is being built.
*/

export default function({hint, height}){    

    return React.createElement(
        'div', 
        {
            className: 'placeholder',
            style: {
                height
            }
        },
        React.createElement('span', {}, 'A remplir'),
        hint ? React.createElement('span', {className: 'hint'}, hint) : undefined
    )
}
