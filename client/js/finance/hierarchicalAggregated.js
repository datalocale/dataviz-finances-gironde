import {rules} from './m52ToAggregated';

const ruleIds = Object.freeze(Object.keys(rules));

const levelCategories = {
    name: "Instruction Agrégée",
    children : [
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
    ]
};



/**
 * rows : ImmutableSet<Record<AggEntry>>
 */
export default function(aggRows) {

    function makeCorrespondingSubtree(sourceNode){
        const correspondingTargetNode = {
            name: sourceNode.name,
            ownValue: 0,
            total: 0,
            children: new Set(),
            elements: new Set()
        };

        // build the tree first
        sourceNode.children.forEach(child => {
            if(typeof child === 'string'){
                // aggRows.find over all tree nodes is O(n²)
                const childRow = aggRows.find(r => r.id === child); 
                correspondingTargetNode.elements.add(childRow);
                correspondingTargetNode.total += childRow["Montant"];
            }
            else{
                correspondingTargetNode.children.add(makeCorrespondingSubtree(child));
            }
        });

        // then compute total and elements
        correspondingTargetNode.children.forEach(child => {
            correspondingTargetNode.total += child.total;
            child.elements.forEach(e => correspondingTargetNode.elements.add(e));
        })

        return correspondingTargetNode;
    }


    return makeCorrespondingSubtree(levelCategories);
};