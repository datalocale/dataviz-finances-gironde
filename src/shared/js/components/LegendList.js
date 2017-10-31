import React from 'react';

export default function({items}){    

    return React.createElement('ol', {className: 'legend-list'},
        items.map(({className, url, text, colorClassName}) => {
            return React.createElement('li', {className},
                React.createElement(url ? 'a' : 'span', {href: url},
                    React.createElement('span', {className: `color ${colorClassName}`}), 
                    ' ',
                    text
                )
            )
        })
    )
}
