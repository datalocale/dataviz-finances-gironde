import React from 'react'

function makeUnusedM52RowsSet(aggregatedInstruction, M52Instruction){
    return M52Instruction.filter(m52row => {
        return !aggregatedInstruction.some(aggRow => aggRow['M52Rows'].has(m52row))
    })
}

function makeUsedMoreThanOnceM52RowsSet(aggregatedInstruction, M52Instruction){
    const m52RowToAggRows = new Map();

    M52Instruction.forEach(m52row => {
        const usingAggRows = new Set();
        
        aggregatedInstruction.forEach(aggRow => {
            if(aggRow['M52Rows'].has(m52row)){
                usingAggRows.add(aggRow);
            }
        });

        if(usingAggRows.size >= 2){
            m52RowToAggRows.set(m52row, usingAggRows)
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
export default function(props){
    const {aggregatedInstruction, M52Instruction} = props;

    const unusedM52Set = makeUnusedM52RowsSet(aggregatedInstruction, M52Instruction);
    const usedMoreThanOnceM52RowsSet = makeUsedMoreThanOnceM52RowsSet(aggregatedInstruction, M52Instruction);

    return React.createElement('div', {}, 
        React.createElement('table', {className: 'aggregated'}, aggregatedInstruction.map(aggRow => (
            React.createElement(
                'tr', 
                {
                    key: aggRow['id'],
                    className: [
                        aggRow['M52Rows'].size === 0 ? 'zero-m52' : '', 
                        aggRow['Statut'] === 'TEMPORARY' ? 'temporary' : ''
                    ].filter(c => c).join(' ')
                }, 
                React.createElement('td', {}, aggRow['id']),
                React.createElement('td', {}, aggRow['M52Rows'].size),
                React.createElement('td', {}, aggRow['Libellé']),
                React.createElement('td', {}, aggRow['Montant'].toFixed(2)+'€')
            )
        ))),
        React.createElement('div', {}, 
            React.createElement('h1', {}, "Lignes M52 utilisées dans aucune formule d'aggrégation ("+unusedM52Set.size+")"),
            React.createElement('ul', {}, unusedM52Set.map(m52 => {
                // TODO rajouter montants
                const m52Id = makeM52RowId(m52);

                return React.createElement('li', {key: m52Id}, m52Id)
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