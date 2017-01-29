import {Set as ImmutableSet} from 'immutable';

import {rules} from './m52ToAggregated';
import {PAR_PUBLIC_VIEW, PAR_PRESTATION_VIEW} from './constants';

const ruleIds = Object.freeze(Object.keys(rules));

const DFparPublicChild = {
    name: "Actions sociales par publics",
    children: ruleIds.filter(id => id.startsWith('DF-2'))
};

const DFparPrestationChild = {
    name: "Actions sociales par prestations",
    children: [
        {
            name: "Frais d'hébergement",
            children: ruleIds.filter(id => id.startsWith('DF-1-1'))
        },
        'DF-1-2',
        'DF-1-3',
        'DF-1-4',
        {
            name: "Divers enfants",
            children: ruleIds.filter(id => id.startsWith('DF-1-5'))
        },
        'DF-1-6',
        {
            name: "Divers social",
            children: ruleIds.filter(id => id.startsWith('DF-1-7'))
        }
    ]
}



const levelsByRDFI = {
    'RF': {
        name: 'Recettes de fonctionnement',
        children: [
            {
                name: "Fiscalité directe",
                children: ruleIds.filter(id => id.startsWith('RF-1'))
            },
            {
                name: "Fiscalité transférée",
                children: ruleIds.filter(id => id.startsWith('RF-2'))
            },
            {
                name: "Droits de mutation à titre onéreux (DMTO)",
                children: ruleIds.filter(id => id.startsWith('RF-3'))
            },
            {
                name: "Autres fiscalités",
                children: ruleIds.filter(id => id.startsWith('RF-4'))
            },
            {
                name: "Dotations de l’État et compensations",
                children: ruleIds.filter(id => id.startsWith('RF-5'))
            },
            {
                name: "Recettes sociales",
                children: ruleIds.filter(id => id.startsWith('RF-6'))
            },
            {
                name: "Péréquation sociale",
                children: ruleIds.filter(id => id.startsWith('RF-7'))
            },
            {
                name: "Péréquation horizontale",
                children: ruleIds.filter(id => id.startsWith('RF-8'))
            },
            {
                name: "Recettes diverses",
                children: ruleIds.filter(id => id.startsWith('RF-9'))
            }
        ]
    },
    'DF': Object.freeze({
        name: 'Dépenses de fonctionnement',
        children: new ImmutableSet([
            {
                name: "Actions d’intervention",
                children: ruleIds.filter(id => id.startsWith('DF-3'))
            },
            {
                name: "Frais de personnel",
                children: ruleIds.filter(id => id.startsWith('DF-4'))
            },
            {
                name: "Péréquation verticale",
                children: ruleIds.filter(id => id.startsWith('DF-5'))
            },
            {
                name: "Autres charges",
                children: ruleIds.filter(id => id.startsWith('DF-6'))
            },
            {
                name: "Frais généraux",
                children: ruleIds.filter(id => id.startsWith('DF-7'))
            },
            {
                name: "Frais financiers",
                children: ruleIds.filter(id => id.startsWith('DF-8'))
            }
        ])
    }),
    'RI': {
        name: 'Recettes d’investissement',
        children: ruleIds
            .filter(id => id.match(/RI-\d/))
            .concat([
                {
                    name: 'Emprunt contracté',
                    children: ruleIds.filter(id => id.startsWith('RI-EM'))
                }
            ])
    },
    'DI': {
        name: 'Dépenses d’investissement',
        children: [
            {
                name: "Equipements Propres",
                children: ruleIds.filter(id => id.startsWith('DI-1'))
            },
            {
                name: "Subventions",
                children: ruleIds.filter(id => id.startsWith('DI-2'))
            },
            {
                name: 'Emprunt remboursé',
                children: ruleIds.filter(id => id.startsWith('DI-EM'))
            }
        ]
    }
};



/**
 * rows : ImmutableSet<Record<AggEntry>>
 */
export default function(aggRows, rdfi, view = PAR_PUBLIC_VIEW) {
    const rdfiId = rdfi.rd + rdfi.fi;
    let levels = levelsByRDFI[rdfiId];

    if(rdfiId === 'DF'){
        switch(view){
            case PAR_PUBLIC_VIEW:
                levels = Object.assign({}, levels);
                levels.children = levels.children.add(DFparPublicChild); 
                break;   
            case PAR_PRESTATION_VIEW: 
                levels = Object.assign({}, levels);
                levels.children = levels.children.add(DFparPrestationChild);
                break;
            default:
                throw new Error('Misunderstood view ('+view+')')
        }
    }

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

                correspondingTargetNode.children.add({
                    name: childRow['Libellé'],
                    ownValue: childRow["Montant"],
                    total: childRow["Montant"],
                    elements: new Set([childRow])
                });
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

    return makeCorrespondingSubtree(levels);
};