import {csvParse} from 'd3-dsv';
import {SplitLigneBudgetRecord} from './DocBudgDataStructures.js';

export function format(rows){

    rows.forEach(function(row){
        row["MtReal"] = Number(row["MtReal"]);
        row["Exer"] = Number(row["Exer"]);
        
        Object.freeze(row);
    });

    return rows;
}

export default function(csvString){
    const rows = csvParse(csvString);
    const corrections = format(rows.map(c => {
        return Object.assign(
            {
                splitFor: c['Identifiant agrégé']
            },
            c
        )
    }))
    .map(c => new SplitLigneBudgetRecord(c));

    return corrections;
}
