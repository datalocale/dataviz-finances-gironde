import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';

import memoize from '../memoize';

// using require because importing doesn't seem to work with rollupify otherwise
// path is relative to the main (which is terrible but works for now)
import {fonctionLabels} from '../../../../build/finances/m52-strings.json'; 

const levelCategories = [
    r => {
        const R = r['Fonction'];
        return R.slice(0, 1);
    },
    r => {
        const R = r['Fonction'];
        return R[1] ? R.slice(0, 2) : undefined;
    },
    r => {
        const R = r['Fonction'];
        return R[2] ? R.slice(0, 3) : undefined;
    },
    r => {
        const R = r['Fonction'];
        return R[3] ? R.slice(0, 4) : undefined;
    }
]


/**
 * Transforms an M52 instruction to its hierarchical form so it can be represented visually with hierarchy
 * 
 * rows : ImmutableSet<Record<M52Entry>>
 * M52Entry keys are column names of 
 * https://www.datalocale.fr/dataset/comptes-administratifs-du-departement-de-la-gironde/resource/c32d35f0-3998-40c9-babe-b70af4576baa
 */
export function hierarchicalM52({rows}, planDeCompte, RDFI) {
    rows = rows
    .filter(row => row['CodRD'] === RDFI[0] && planDeCompte.ligneBudgetFI(row) === RDFI[1]);
    
    const root = {
        id: 'M52',
        label: "Instruction M52",
        elements: rows,
    };


    /* TreeNode : HierarchicalData<M52Entry> 
    {
        id: '',
        label: 'str'
        ownValue: Number, // for nodes with children, this is the own value
        total?: Number,
        children?: Map<category, Set<TreeNode>>

        elements?: Set<M52Entry>
    }
    */

    function buildTree(node, parentCategory, level){
        const categorizer = levelCategories[level];
        const children = new Map();
        let total = 0;
        let ownValue = 0;

        node.elements.forEach(r => {
            const category = categorizer(r);
            total += r["MtReal"];

            if(category){
                if(category === parentCategory){
                    // value belongs to ownValue, not children
                    ownValue += r["MtReal"]
                }
                else{
                    let categoryChild = children.get(category);
                    if(!categoryChild){
                        const label = fonctionLabels[category]

                        if(!label){
                            console.warn('No label for rubrique', category);
                        }

                        categoryChild = {
                            id: `M52-${RDFI}-${category}`,
                            label,
                            elements: new ImmutableSet()
                        }
                        children.set(category, categoryChild);
                    }
                    categoryChild.elements = categoryChild.elements.add(r);
                }   
            }
        });

        node.total = total;
        node.ownValue = ownValue;
        node.children = new ImmutableMap(children);
        children.forEach((child, category) => {
            if(levelCategories[level+1])
                buildTree(child, category, level+1)
        });
    }

    buildTree(root, root.id, 0);

    return root;
}

export default memoize(hierarchicalM52)
