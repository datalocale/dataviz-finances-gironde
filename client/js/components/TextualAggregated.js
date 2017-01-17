import React from 'react'

/*
TODO :
    * which M52 rows are unused (amount of money and % over M52 total)
    * which M52 rows are used several times
    * which agg rules gathered no M52 rows
 */

function makeUnusedM52RowsSet(aggregatedInstruction, M52Instruction){
    return M52Instruction.filter(m52row => {
        return !aggregatedInstruction.some(aggRow => aggRow['M52Rows'].has(m52row))
    })
}

export default function(props){
    const {aggregatedInstruction, M52Instruction} = props;

    const unusedM52Set = makeUnusedM52RowsSet(aggregatedInstruction, M52Instruction);

    return React.createElement('div', {}, 
        React.createElement('table', {}, aggregatedInstruction.map(aggRow => (
            React.createElement('tr', {key: aggRow['id']}, 
                React.createElement('td', {}, aggRow['id']),
                React.createElement('td', {}, aggRow['M52Rows'].size),
                React.createElement('td', {}, aggRow['Libellé']),
                React.createElement('td', {}, aggRow['Montant'].toFixed(2)+'€')
            )
        ))),
        React.createElement('div', {}, 
            React.createElement('h1', {}, "Lignes M52 utilisées dans aucune formule d'aggrégation ("+unusedM52Set.size+")"),
            React.createElement('ul', {}, unusedM52Set.map(m52 => {
                const m52Id = m52["Rubrique fonctionnelle"] + ' ' + m52["Article"] + ' ' + m52["Chapitre"];

                return React.createElement('li', {key: m52Id}, m52Id)
            }))
        )
    );
}