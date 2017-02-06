import React from 'react';
import {OrderedSet} from 'immutable';
import {format} from 'currency-formatter';

import {M52_INSTRUCTION, AGGREGATED_INSTRUCTION} from '../finance/constants';


function makeM52RowId(m52Row){
    return [
        m52Row['Dépense/Recette'] + m52Row['Investissement/Fonctionnement'],
        m52Row['Chapitre'],
        m52Row['Rubrique fonctionnelle'],
        m52Row['Article']
    ].join(' ');
}

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
            React.createElement('table', {}, m52Rows.map(m52 => {
                const m52Id = makeM52RowId(m52);

                return React.createElement('tr', {key: m52Id},
                    React.createElement('td', {}, m52Id),
                    React.createElement('td', {className: 'money-amount'}, format(m52['Montant'], { code: 'EUR' }))
                );
            }))
        );
    }
}
