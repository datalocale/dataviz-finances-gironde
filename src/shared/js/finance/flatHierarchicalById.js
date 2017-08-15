import visit from './visitHierarchical';

import {levels} from './hierarchicalAggregated';
import {rules} from './m52ToAggregated';

export const childToParent = new Map();
export const elementById = new Map();

visit(levels, e => {
    elementById.set(e.id, e);

    if(e.children){
        e.children.forEach(c => {
            if(typeof c === 'string'){
                childToParent.set(c, e.id);
                elementById.set(c, rules[c]);

                if(!rules[c]){
                    console.error('No rule for', c);
                }
            }
            else{
                childToParent.set(c.id, e.id);
            }

        })
    }
});
