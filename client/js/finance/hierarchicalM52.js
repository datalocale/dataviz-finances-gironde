const levelCategories = [
    r => r['Dépense/Recette'],
    r => r['Investissement/Fonctionnement'],
    r => {
        const R = r['Rubrique fonctionnelle'];
        return R[1];
    },
    r => {
        const R = r['Rubrique fonctionnelle'];
        return R[2] ? R.slice(1, 3) : undefined;
    },
    r => {
        const R = r['Rubrique fonctionnelle'];
        return R[3] ? R.slice(1, 4) : undefined;
    },
    r => {
        const R = r['Rubrique fonctionnelle'];
        return R[4] ? R.slice(1, 5) : undefined;
    }
]

/**
 * rows : ImmutableSet<Record<M52Entry>>
 * M52Entry keys are column names of 
 * https://www.datalocale.fr/dataset/comptes-administratifs-du-departement-de-la-gironde/resource/c32d35f0-3998-40c9-babe-b70af4576baa
 */
export default function(rows) {
    const root = {
        name: "M52",
        rows,
    };

    /* TreeNode : 
    {
        name: '',
        ownValue: Number, // for nodes with children, this is the own value
        total?: Number,
        children?: Map<category, Set<TreeNode>>

        rows?: Set<M52Entry>
    }
    */

    // create first level.
    // for all categories in first level, create next level. 

    function buildTree(node, parentCategory, level){
        const categorizer = levelCategories[level];
        const children = new Map();
        let total = 0;
        let ownValue = 0;

        node.rows.forEach(r => {
            const category = categorizer(r);
            total += r["Montant"];

            if(category){
                if(category === parentCategory){
                    // value belongs to ownValue, not children
                    ownValue += r["Montant"]
                }
                else{
                    let categoryChild = children.get(category);
                    if(!categoryChild){
                        categoryChild = {
                            name: category,
                            rows: new Set()
                        }
                        children.set(category, categoryChild);
                    }
                    categoryChild.rows.add(r);
                }   
            }
        });

        node.total = total;
        node.ownValue = ownValue;
        node.children = children;
        children.forEach((child, category) => {
            if(levelCategories[level+1])
                buildTree(child, category, level+1)
        });
    }

    buildTree(root, root.name, 0);

    return root;
};