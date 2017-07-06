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

/*
React.createElement('ol', {},
    barchartPartitionByYear.get(year).map((p, i) => {
        return React.createElement('li', {className: p.contentId},
            React.createElement('a', {href: p.url},
                React.createElement('span', {className: `color area-color-${i+1}`}), ' ',
                p.texts.label
            )
        )
    })
)

*/