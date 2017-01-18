import {rules} from './m52ToAggregated';

const ruleIds = Object.freeze(Object.keys(rules));

const levelCategories = [
    {
        name: 'Recettes de fonctionnement',
        children: [
            {
                name: "Fiscalité directe",
                children: ruleIds.filter(id => id.startsWith('RF1'))
            },
            {
                name: "Dotations de l’État et compensations",
                children: ruleIds.filter(id => id.startsWith('RF2'))
            },
            {
                name: "Fiscalité transférée",
                children: ruleIds.filter(id => id.startsWith('RF3'))
            },
            {
                name: "Droits de mutation à titre onéreux (DMTO)",
                children: ruleIds.filter(id => id.startsWith('RF4'))
            },
            {
                name: "Recettes sociales",
                children: ruleIds.filter(id => id.startsWith('RF5'))
            },
            {
                name: "Autres fiscalités",
                children: ruleIds.filter(id => id.startsWith('RF6'))
            },
            {
                name: "Recettes diverses",
                children: ruleIds.filter(id => id.startsWith('RF7'))
            },
            {
                name: "Fonds de peréquations",
                children: ruleIds.filter(id => id.startsWith('RF8'))
            }
        ]
    },
    {
        name: 'Dépenses de fonctionnement',
        children: [
            {
                name: "Actions sociales par prestations",
                children: [
                    {
                        name: "Frais d'hébergement",
                        children: ruleIds.filter(id => id.startsWith('DF1_1'))
                    },
                    'DF1_2',
                    'DF1_3',
                    'DF1_4',
                    {
                        name: "Divers enfants",
                        children: ruleIds.filter(id => id.startsWith('DF1_5'))
                    },
                    'DF1_6',
                    {
                        name: "Divers social",
                        children: ruleIds.filter(id => id.startsWith('DF1_7'))
                    }
                ]
            },
            {
                name: "Actions sociales par publics",
                children: ruleIds.filter(id => id.startsWith('DF2'))
            },
            {
                name: "Actions d’intervention",
                children: ruleIds.filter(id => id.startsWith('DF3'))
            },
            {
                name: "Frais de personnel",
                children: ruleIds.filter(id => id.startsWith('DF4'))
            },
            {
                name: "Versement au fonds de peréquations",
                children: ruleIds.filter(id => id.startsWith('DF5'))
            },
            {
                name: "Autres charges",
                children: ruleIds.filter(id => id.startsWith('DF6'))
            },
            {
                name: "Frais généraux",
                children: ruleIds.filter(id => id.startsWith('DF7'))
            },
            {
                name: "Frais financiers",
                children: ruleIds.filter(id => id.startsWith('DF8'))
            }
        ]
    },
    {
        name: 'Recettes d’investissement',
        children: ruleIds.filter(id => id.startsWith('RI'))
    },
    {
        name: 'Dépenses d’investissement',
        children: [
            {
                name: "Equipements Propres",
                children: ruleIds.filter(id => id.startsWith('DI1'))
            },
            {
                name: "Subventions",
                children: ruleIds.filter(id => id.startsWith('DI2'))
            }
        ]
    }
];



/**
 * rows : ImmutableSet<Record<AggEntry>>
 */
export default function(rows) {
    const root = {
        name: "Instruction Agrégée"
    };

    // from an exising node in levelCategories
    // create the child nodes (recursive)
    // get all the rows from children
    // return a corresponding node with the proper agg


    /* TreeNode : HierarchicalData<M52Entry> 
    {
        name: '',
        ownValue: Number, // for nodes with children, this is the own value
        total?: Number,
        children?: Map<category, Set<TreeNode>>

        elements?: Set<M52Entry>
    }
    */

    /*function buildTree(node, parentCategory, level){
        const categorizer = levelCategories[level];
        const children = new Map();
        let total = 0;
        let ownValue = 0;

        node.elements.forEach(r => {
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
                            elements: new Set()
                        }
                        children.set(category, categoryChild);
                    }
                    categoryChild.elements.add(r);
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
    */
    return root;
};