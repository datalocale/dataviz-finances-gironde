import { List } from 'immutable';

import React from 'react';

import M52Viz from '../../../shared/js/components/M52Viz';

/*
interface M52ByFonctionProps{
    
}
 */

export default function M52ByFonction({m52Hierarchical, urlByFonction, labelsById}) {

    return React.createElement('div', {className: 'm52-by-fonction'}, 
        React.createElement(M52Viz, {
            M52Hierarchical: m52Hierarchical,
            donutWidth: 130, 
            outerRadius: 240,
            /*M52HighlightedNodes,
            selectedNode: selection && selection.type === M52_INSTRUCTION ? selection.node : undefined,
            onSliceOvered: onM52NodeOvered,
            onSliceSelected: onM52NodeSelected*/
        }),
        React.createElement('div', {}, 
            React.createElement('ul', {className: 'legend'},
                new List(m52Hierarchical.children)
                .sort((c1, c2) => c2.total - c1.total)
                .map((e, i) => {
                    return React.createElement('li', {},
                        React.createElement('a', {href: urlByFonction[e.id]},
                            React.createElement('span', {className: `color ${e.id}`}),
                            labelsById.get(e.id)
                        )
                    )
                })
            )

        )
    )
}
