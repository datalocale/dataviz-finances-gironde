import { List } from 'immutable';

import React from 'react';

import M52Viz from '../../../shared/js/components/M52Viz';
import {hierarchicalM52} from '../../../shared/js/finance/memoized';
import {DF, DI} from '../../../shared/js/finance/constants';

const STATE_DF = {rdfi: DF};
const STATE_DI = {rdfi: DI};

/*
interface M52ByFonctionProps{
    
}
 */


function stripAllButFirstLevel(root){
    const children = []
    root.children.forEach(c => children.push(c));

    return Object.assign(
        {},
        root,
        {
            children: new Set(children.map(c => {
                const copy = Object.assign({}, c);
                delete copy.children;

                return copy;
            }))
        }

    )
}

export default class M52ByFonction extends React.Component {
    constructor(){
        super();
        this.state = STATE_DF;
    }

    render() {
        const { m52Instruction, urlByFonction, labelsById } = this.props;
        const {rdfi} = this.state;

        const m52Hierarchical = m52Instruction ? stripAllButFirstLevel(hierarchicalM52(m52Instruction, rdfi)) : undefined;

        return React.createElement('div', { className: 'm52-by-fonction' },
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
                React.createElement('div', {}, 
                    React.createElement('label', {},
                        `Dépenses de fonctionnement`,
                        React.createElement('input', {
                            type: 'radio',
                            name: 'rdfi',
                            defaultChecked: rdfi === DF,
                            onClick: () => {
                                this.setState(STATE_DF)
                            }
                        })
                    ), 
                    React.createElement('label', {},
                        `Dépenses d'investissement`,
                        React.createElement('input', {
                            type: 'radio',
                            name: 'rdfi',
                            defaultChecked: rdfi === DI,
                            onClick: () => {
                                this.setState(STATE_DI)
                            }
                        })
                    )
                ),

                React.createElement('ul', { className: 'legend' },
                    new List(m52Hierarchical.children)
                        .sort((c1, c2) => c2.total - c1.total)
                        .map((e, i) => {
                            return React.createElement('li', {},
                                React.createElement('a', { href: urlByFonction[e.id] },
                                    React.createElement('span', { className: `color ${e.id}` }),
                                    labelsById.get(e.id)
                                )
                            )
                        })
                )
            )
        )
    }
}