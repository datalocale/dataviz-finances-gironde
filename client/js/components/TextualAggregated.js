import React from 'react'

/*
id,
        "Libellé": rule.label,
        "M52Rows": m52Rows,
        "Montant": m52Rows.reduce(((acc, curr) => {
            return acc + curr["Montant"]
        }), 0)
 */

export default function(props){
    const {aggregatedInstruction, M52Instruction} = props;
    return React.createElement('div', {}, 
        React.createElement('ul', {}, aggregatedInstruction.map(aggRow => (
            React.createElement('li', {}, 
                React.createElement('span', {}, aggRow['id']),
                ' ',
                React.createElement('span', {}, aggRow['M52Rows'].size),
                ' ',
                React.createElement('span', {}, aggRow['Libellé']),
                ' ',
                React.createElement('span', {}, aggRow['Montant'])
            )
        )))
    );
}