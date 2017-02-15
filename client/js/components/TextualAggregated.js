import React from 'react'
import {format} from 'currency-formatter'

import {isOR} from '../finance/m52ToAggregated';

function makeUnusedM52RowsSet(aggregatedInstruction, M52Instruction){
    return M52Instruction.filter(m52row => {
        return !aggregatedInstruction.some(aggRow => aggRow['M52Rows'].has(m52row)) && isOR(m52row);
    })
}

function makeUsedMoreThanOnceM52RowsSet(aggregatedInstruction, M52Instruction){
    const m52RowToAggRows = new Map();

    const actionsSocialesParPrestationsRows = aggregatedInstruction
        .filter( r => r.id.startsWith('DF-1'))
        .map( r => r["M52Rows"] )
        .flatten(1);

    const actionsSocialesParPubliqueRows = aggregatedInstruction
        .filter( r => r.id.startsWith('DF-2'))
        .map( r => r["M52Rows"] )
        .flatten(1);

    M52Instruction.forEach(m52row => {
        const usingAggRows = new Set();
        
        aggregatedInstruction.forEach(aggRow => {
            if(aggRow['M52Rows'].has(m52row)){
                usingAggRows.add(aggRow);
            }
        });

        if(usingAggRows.size >= 2){
            if(usingAggRows.size === 2 && 
                actionsSocialesParPrestationsRows.has(m52row) &&
                actionsSocialesParPubliqueRows.has(m52row)
            ){
                // skip, because it's expected
            }
            else{
                m52RowToAggRows.set(m52row, usingAggRows)
            }
        }
    });

    return m52RowToAggRows;
}

function makeM52RowId(m52Row){
    return [
        m52Row['Dépense/Recette'] + m52Row['Investissement/Fonctionnement'],
        m52Row["Chapitre"],
        m52Row["Rubrique fonctionnelle"],
        m52Row["Article"]
    ].join(' ');
}

/*

interface TextualAggregated{
    M52Instruction: M52Instruction
    aggregatedInstruction : AggregatedInstruction
}

*/
export default class TextualSelected extends React.PureComponent{

    render(){
        const {aggregatedInstruction, M52Instruction} = this.props;

        const unusedM52Set = makeUnusedM52RowsSet(aggregatedInstruction, M52Instruction);
        const usedMoreThanOnceM52RowsSet = makeUsedMoreThanOnceM52RowsSet(aggregatedInstruction, M52Instruction);

        return React.createElement('div', {}, 
            React.createElement('div', {}, 
                React.createElement('h1', {}, "Tableau aggrégé"),
                React.createElement('table', {className: 'aggregated'}, aggregatedInstruction.map(aggRow => (
                    React.createElement(
                        'tr', 
                        {
                            key: aggRow['id'],
                            className: [
                                aggRow['M52Rows'].size === 0 ? 'zero-m52' : '', 
                                aggRow['Statut'] === 'TEMPORARY' ? 'temporary' : '',
                                aggRow['Statut'] === 'AMOUNT_ISSUE' ? 'amount-issue' : ''
                            ].filter(c => c).join(' ')
                        }, 
                        React.createElement('td', {}, aggRow['id']),
                        React.createElement('td', {}, aggRow['Libellé']),
                        React.createElement('td', {className: 'money-amount'}, format(aggRow['Montant'], { code: 'EUR' })),
                        React.createElement('td', {}, aggRow['M52Rows'].size)
                    )
                )))
            ),
            React.createElement('div', {}, 
                React.createElement('h1', {}, "Lignes M52 utilisées dans aucune formule d'aggrégation ("+unusedM52Set.size+")"),
                React.createElement('table', {}, unusedM52Set.map(m52 => {
                    const m52Id = makeM52RowId(m52);

                    return React.createElement('tr', {key: m52Id}, 
                        React.createElement('td', {}, m52Id),
                        React.createElement('td', {className: 'money-amount'}, format(m52["Montant"], { code: 'EUR' }))
                    )
                }))
            ),
            React.createElement('div', {}, 
                React.createElement('h1', {}, "Lignes M52 utilisées dans au moins 2 formules d'aggrégation ("+usedMoreThanOnceM52RowsSet.size+")"),
                React.createElement('ul', {}, Array.from(usedMoreThanOnceM52RowsSet).map(([m52Row, aggSet]) => {
                    const m52Id = makeM52RowId(m52Row);

                    return React.createElement('li', {key: m52Id}, 
                        m52Id,
                        ' utilisé dans ',
                        [...aggSet].map(aggRow => aggRow.id).join(', ')
                    )
                }))
            )        
        );
    }
};