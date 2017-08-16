import visit from './visitHierarchical';

import {levels} from './hierarchicalAggregated';
import {rules} from './m52ToAggregated';

const rubriqueIdToLabel = require('./m52FonctionLabels.json');

export const childToParent = new Map();
export const elementById = new Map();

visit(levels, e => {
    if(e.children){
        e.children.forEach(c => {
            if(typeof c === 'string'){
                childToParent.set(c, e.id);
                elementById.set(c, rules[c]);
            }
            else{
                childToParent.set(c.id, e.id);
                elementById.set(e.id, e);
            }

        })
    }
});


Object.keys(rubriqueIdToLabel).forEach(r => {
    elementById.set(r, {label: rubriqueIdToLabel[r]});

    if(r.length >= 3){
        const parentId = r.slice(0, -1);
        childToParent.set(r, parentId);
    }
})