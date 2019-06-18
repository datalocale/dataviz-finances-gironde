import {dsvFormat} from 'd3-dsv';
import {SplitLigneBudgetRecord} from './DocBudgDataStructures.js';

const semiColonSVParse = dsvFormat(';').parse

export function format(rows){

    rows.forEach(function(row){
        row["MtReal"] = Number(row["MtReal"]);
        row["Exer"] = Number(row["Exer"]);
        
        Object.freeze(row);
    });

    return rows;
}

export default function(csvString){
    const rows = semiColonSVParse(csvString);
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