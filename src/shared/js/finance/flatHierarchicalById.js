import visit from './visitHierarchical';

import {levels} from './hierarchicalAggregated';
import {rules} from './m52ToAggregated';

import {fonctionLabels} from '../../../../build/finances/m52-strings.json';
 
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
                elementById.set(c.id, c);
            }
        })
    }
});


Object.keys(fonctionLabels).forEach(r => {
    elementById.set(r, {label: fonctionLabels[r]});

    if(r.length >= 2){
        const parentId = r.slice(0, -1);
        childToParent.set(r, parentId);
    }
})