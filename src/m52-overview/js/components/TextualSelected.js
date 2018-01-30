import React from 'react';
import {OrderedSet} from 'immutable';
import {format} from 'currency-formatter';

import {M52_INSTRUCTION, AGGREGATED_INSTRUCTION} from '../../../shared/js/finance/constants';
import {makeLigneBudgetId} from '../../../shared/js/finance/DocBudgDataStructures';


export default class TextualSelected extends React.PureComponent{

    render(){
        const {selection} = this.props;
        const {type, node} = selection;

        const m52Rows = type === M52_INSTRUCTION ?
            Array.from(node.elements) :
            type === AGGREGATED_INSTRUCTION ?
                new OrderedSet(Array.from(node.elements).map(e => e['M52Rows'])).flatten(1) :
                undefined;

        return React.createElement('div', {},
            React.createElement('h1', {}, type === M52_INSTRUCTION ? 'Morceau de la M52 sélectionnée' : 'Morceau de l\'agrégée selectionné'),
            React.createElement('h2', {}, node.id + ' ' + node.label),
            React.createElement('h3', {className: 'money-amount'}, format(node.total, { code: 'EUR' })),
            React.createElement('table', {}, 
                React.createElement('tbody', {}, 

                    m52Rows.map((m52, i) => {
                        const m52Id = makeLigneBudgetId(m52);

                        return React.createElement('tr', {key: m52Id+i},
                            React.createElement('td', {}, m52Id),
                            React.createElement('td', {className: 'money-amount'}, format(m52['MtReal'], { code: 'EUR' }))
                        );
                    })
                )
            )
            
        );
    }
}
