import {Set} from 'immutable';

import {csvParse} from 'd3-dsv';
import {cleanup} from './csvStringToM52Instructions.js';
import {SplitLigneBudgetRecord} from './DocBudgDataStructures.js';

export default function(csvString){
    const rows = csvParse(csvString);
    const corrections = cleanup(rows.map(c => {
        return Object.assign(
            {
                'Type nomenclature': 'M52',
                splitFor: c['Identifiant agrégé']
            },
            c
        )
    }))
    .map(c => new SplitLigneBudgetRecord(c));

    return new Set(corrections);

}