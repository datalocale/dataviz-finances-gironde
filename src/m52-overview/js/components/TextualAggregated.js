import React from 'react';
import {format} from 'currency-formatter';
import {sum} from 'd3-array';

import {hierarchicalAggregated} from '../../../shared/js/finance/memoized';
import {makeLigneBudgetId} from '../../../shared/js/finance/DocBudgDataStructures';
import {flattenTree} from '../../../shared/js/finance/visitHierarchical';

function makeUnusedM52RowsSet(aggregatedInstruction, rows){
    // an M52 row is not used if its id is used in no agg row

    return rows.filter(m52row => {
        const rid = makeLigneBudgetId(m52row);
        return !aggregatedInstruction.some(aggRow => aggRow['M52Rows'].map(makeLigneBudgetId).has(rid));
    })
}

function makeUsedMoreThanOnceM52RowsSet(aggregatedInstruction, rows){
    const m52RowToAggRows = new Map();

    const actionsSocialesParPrestationsRows = aggregatedInstruction
        .filter( r => r.id.startsWith('DF.1'))
        .map( r => r["M52Rows"] )
        .flatten(1);

    const actionsSocialesParPubliqueRows = aggregatedInstruction
        .filter( r => r.id.startsWith('DF.2'))
        .map( r => r["M52Rows"] )
        .flatten(1);

    rows.forEach(m52row => {
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

function makeDF12Diffs(aggregatedInstruction){
    const hierAgg = hierarchicalAggregated(aggregatedInstruction)
    const aggRows = flattenTree(hierAgg);

    const df1 = aggRows.find(r => r.id === 'DF.1');
    const df2 = aggRows.find(r => r.id === 'DF.2');

    const df1M52Rows = df1.elements.map(e => e['M52Rows']).flatten(1);
    const df2M52Rows = df2.elements.map(e => e['M52Rows']).flatten(1);


    // For now, weighted rows are only in DF1, so let's keep things simple
    const splitDF1Rows = df1M52Rows.filter(r => r.splitFor);

    const splitByRowId = new Map();
    splitDF1Rows.forEach(r => {
        const id = makeLigneBudgetId(r);

        let elements = splitByRowId.get(id);
        if(!elements){
            elements = [];
        }
        elements.push(r);
        splitByRowId.set(id, elements);
    });

    let onlyDF1 = df1M52Rows.subtract(df2M52Rows);
    let onlyDF2 = df2M52Rows.subtract(df1M52Rows);

    splitByRowId.forEach((elements, id) => {
        const total = sum(elements.map(r => r['MtReal']))

        const corresponding = onlyDF2.find(r => makeLigneBudgetId(r) === id);
        
        if(Math.abs(corresponding['MtReal'] - total) <= 0.01){
            elements.forEach(e => {
                onlyDF1 = onlyDF1.remove(e)
            })
            onlyDF2 = onlyDF2.remove(corresponding)
        }
    })

    return { onlyDF1, onlyDF2 }
}



/*

interface TextualAggregated{
    M52Instruction: M52Instruction
    aggregatedInstruction : AggregatedInstruction
}

*/
export default class TextualSelected extends React.PureComponent{

    render(){
        const {aggregatedInstruction, documentBudgetaire} = this.props;
        const m52Rows = documentBudgetaire.rows;

        const unusedM52Set = makeUnusedM52RowsSet(aggregatedInstruction, m52Rows);
        const usedMoreThanOnceM52RowsSet = makeUsedMoreThanOnceM52RowsSet(aggregatedInstruction, m52Rows);
        const {onlyDF1, onlyDF2} = makeDF12Diffs(aggregatedInstruction);

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
                    const m52Id = makeLigneBudgetId(m52);

                    return React.createElement('tr', {key: m52Id}, 
                        React.createElement('td', {}, m52Id),
                        React.createElement('td', {className: 'money-amount'}, format(m52["MtReal"], { code: 'EUR' }))
                    )
                }))
            ),
            React.createElement('div', {}, 
                React.createElement('h1', {}, "Lignes M52 utilisées dans au moins 2 formules d'aggrégation ("+usedMoreThanOnceM52RowsSet.size+")"),
                React.createElement('ul', {}, Array.from(usedMoreThanOnceM52RowsSet).map(([m52Row, aggSet]) => {
                    const m52Id = makeLigneBudgetId(m52Row);

                    return React.createElement('li', {key: m52Id}, 
                        m52Id,
                        ` (${format(m52Row["MtReal"], { code: 'EUR' })}) `,
                        ' utilisé dans ',
                        [...aggSet].map(aggRow => aggRow.id).join(', ')
                    )
                }))
            ),
            React.createElement('div', {}, 
                React.createElement('h1', {}, "Lignes M52 utilisées dans DF.1, mais pas dans DF-2 ("+onlyDF1.size+")"),
                React.createElement('ul', {}, Array.from(onlyDF1).map(m52Row => {
                    const m52Id = makeLigneBudgetId(m52Row);

                    return React.createElement('li', {key: m52Id}, 
                        m52Id,
                        ` (${format(m52Row["MtReal"], { code: 'EUR' })}) `
                    )
                }))
            ) ,
            React.createElement('div', {}, 
                React.createElement('h1', {}, "Lignes M52 utilisées dans DF-2, mais pas dans DF-1 ("+onlyDF2.size+")"),
                React.createElement('ul', {}, Array.from(onlyDF2).map(m52Row => {
                    const m52Id = makeLigneBudgetId(m52Row);

                    return React.createElement('li', {key: m52Id}, 
                        m52Id,
                        ` (${format(m52Row["MtReal"], { code: 'EUR' })}) `
                    )
                }))
            )        
        );
    }
}