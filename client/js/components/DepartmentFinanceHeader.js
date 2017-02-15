import {createElement as θ} from 'react';

/*
        rdfi, dfView,
        M52Instruction, aggregatedInstruction,
        M52Hierarchical, M52OveredNodes,
        aggregatedHierarchical, aggregatedOveredNodes,
        over

 */

export default function({department, type, year, children}){

    return θ('header', {className: 'departement-finance'},
        θ('h1', {}, 'Instruction M52 et vision agrégée'),
        θ('div', {},
            θ('h2', {}, 
                'Département ',
                department,
                ' - ',
                type,
                ' - ',
                year
            ),
            children
        )
    );
}
