import {Set as ImmutableSet} from 'immutable';

import {rules} from './m52ToAggregated';
import {PAR_PUBLIC_VIEW, PAR_PRESTATION_VIEW} from './constants';

const ruleIds = Object.freeze(Object.keys(rules));

const DFparPublicChild = {
    id: 'DF-2',
    label: "Actions sociales par publics",
    children: ruleIds.filter(id => id.startsWith('DF-2'))
};

const DFparPrestationChild = {
    id: 'DF-1',
    label: "Actions sociales par prestations",
    children: [
        {
            id: 'DF-1-1',
            label: "Frais d'hébergement",
            children: ruleIds.filter(id => id.startsWith('DF-1-1'))
        },
        'DF-1-2',
        'DF-1-3',
        'DF-1-4',
        {
            id: 'DF-1-5',
            label: "Divers enfants",
            children: ruleIds.filter(id => id.startsWith('DF-1-5'))
        },
        'DF-1-6',
        'DF-1-7'
    ]
};



export const levelsByRDFI = {
    'RF': {
        id: 'RF',
        label: 'Recettes de fonctionnement',
        children: [
            {
                id: 'RF-1',
                label: "Fiscalité directe",
                children: ruleIds.filter(id => id.startsWith('RF-1'))
            },
            {
                id: 'RF-2',
                label: "Fiscalité transférée",
                children: ruleIds.filter(id => id.startsWith('RF-2'))
            },
            'RF-3',
            {
                id: 'RF-4',
                label: "Autres fiscalités",
                children: ruleIds.filter(id => id.startsWith('RF-4'))
            },
            {
                id: 'RF-5',
                label: "Dotations de l’État et compensations",
                children: ruleIds.filter(id => id.startsWith('RF-5'))
            },
            {
                id: 'RF-6',
                label: "Recettes sociales",
                children: ruleIds.filter(id => id.startsWith('RF-6'))
            },
            {
                id: 'RF-7',
                label: "Péréquation sociale",
                children: ruleIds.filter(id => id.startsWith('RF-7'))
            },
            {
                id: 'RF-8',
                label: "Péréquation horizontale",
                children: ruleIds.filter(id => id.startsWith('RF-8'))
            },
            {
                id: 'RF-9',
                label: "Recettes diverses",
                children: ruleIds.filter(id => id.startsWith('RF-9'))
            }
        ]
    },
    'DF': Object.freeze({
        id: 'DF',
        label: 'Dépenses de fonctionnement',
        children: new ImmutableSet([
            {
                id: 'DF-3',
                label: "Actions d’intervention",
                children: [
                    'DF-3-1',
                    'DF-3-2',
                    'DF-3-3',
                    'DF-3-4',
                    'DF-3-5',
                    'DF-3-6',
                    'DF-3-7',
                    {
                        id: 'DF-3-8',
                        label: "Frais de personnel",
                        children: ruleIds.filter(id => id.startsWith('DF-3-7-'))
                    }

                ]
            },
            {
                id: 'DF-4',
                label: "Frais de personnel",
                children: ruleIds.filter(id => id.startsWith('DF-4'))
            },
            {
                id: 'DF-5',
                label: "Péréquation verticale",
                children: ruleIds.filter(id => id.startsWith('DF-5'))
            },
            {
                id: 'DF-6',
                label: "Charges courantes",
                children: [
                    {
                        id: 'DF-6-1',
                        label: "Frais généraux",
                        children: ruleIds.filter(id => id.startsWith('DF-6-1-'))
                    },
                    'DF-6-2',
                    {
                        id: 'DF-6-3',
                        label: "Autres charges",
                        children: ruleIds.filter(id => id.startsWith('DF-6-3-'))
                    }
                ]
            },
            {
                id: 'DF-7',
                label: "Frais généraux",
                children: ruleIds.filter(id => id.startsWith('DF-7'))
            }
        ])
    }),
    'RI': {
        id: 'RI',
        label: 'Recettes d’investissement',
        children: ruleIds
            .filter(id => id.match(/RI-\d+/))
            .concat([
                {
                    id: 'RI-EM',
                    label: 'Emprunt contracté',
                    children: ruleIds.filter(id => id.startsWith('RI-EM'))
                }
            ])
    },
    'DI': {
        id: 'DI',
        label: 'Dépenses d’investissement',
        children: [
            {
                id: 'DI-1',
                label: "Equipements Propres",
                children: ruleIds.filter(id => id.startsWith('DI-1'))
            },
            {
                id: 'DI-2',
                label: "Subventions",
                children: ruleIds.filter(id => id.startsWith('DI-2'))
            },
            {
                id: 'DI-EM',
                label: 'Emprunt remboursé',
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
                throw new Error('Misunderstood view ('+view+')');
        }
    }

    function makeCorrespondingSubtree(sourceNode){
        const correspondingTargetNode = {
            id: sourceNode.id,
            label: sourceNode.label,
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

                correspondingTargetNode.children.add({
                    id: child,
                    label: childRow['Libellé'],
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
        });

        return correspondingTargetNode;
    }

    return makeCorrespondingSubtree(levels);
}