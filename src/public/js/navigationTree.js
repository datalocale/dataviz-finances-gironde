import { EXPENDITURES, REVENUE, DF, RF, DI, RI } from './constants/pages';

import {levelsByRDFI} from '../../shared/js/finance/hierarchicalAggregated';
import {flattenTree} from '../../shared/js/finance/visitHierarchical';

/*
    This file is mostly a json file, but some parts are generated for easier maintenance reasons
 */

const exp = {};

exp[EXPENDITURES] = [ DF, DI ];
exp[REVENUE] = [ RF, RI ];

[DF, RF, DI, RI].forEach(rdfi => {
    flattenTree(levelsByRDFI[rdfi]).forEach(e => {
        if(typeof e === 'string'){
            // leaf case
            return;
        }
        
        exp[e.id] = e.children.map(c => typeof c === 'string' ? c : c.id);
    })
});

export default exp;