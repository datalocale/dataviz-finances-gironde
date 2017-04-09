import {levels} from '../../shared/js/finance/hierarchicalAggregated';
import {flattenTree} from '../../shared/js/finance/visitHierarchical';

/*
    This file is mostly a json file, but some parts are generated for easier maintenance reasons
 */

const exp = {};

flattenTree(levels).forEach(n => {
    if(n === levels){
        // skip top element
        return; 
    }

    if(typeof n === 'string'){
        // leaf case
        return;
    }
    
    exp[n.id] = n.children.map(c => typeof c === 'string' ? c : c.id);
});

export default exp;