import { Record, List, Set as ImmutableSet } from 'immutable';
import { sum } from 'd3-array';

import {makeM52RowId} from './M52InstructionDataStructures';

import { rules } from './m52ToAggregated';
import { PAR_PUBLIC_VIEW, PAR_PRESTATION_VIEW, EXPENDITURES, REVENUE } from './constants';

const ruleIds = Object.freeze(Object.keys(rules));

export const levels = {
    id: 'Total',
    label: 'Total',
    children: [
        {
            id: REVENUE,
            label: 'Recettes',
            children: [
                {
                    id: 'RF',
                    label: 'Recettes de fonctionnement',
                    children: [
                        {
                            id: 'RF-1',
                            label: "Fiscalité directe",
                            children: ruleIds.filter(id => id.startsWith('RF-1-'))
                        },
                        {
                            id: 'RF-2',
                            label: "Fiscalité transférée",
                            children: ruleIds.filter(id => id.startsWith('RF-2-'))
                        },
                        'RF-3',
                        {
                            id: 'RF-4',
                            label: "Autres fiscalités",
                            children: ruleIds.filter(id => id.startsWith('RF-4-'))
                        },
                        {
                            id: 'RF-5',
                            label: "Dotations de l’État et compensations",
                            children: ruleIds.filter(id => id.startsWith('RF-5-'))
                        },
                        {
                            id: 'RF-6',
                            label: "Recettes sociales",
                            children: ruleIds.filter(id => id.startsWith('RF-6-'))
                        },
                        {
                            id: 'RF-7',
                            label: "Péréquation sociale",
                            children: ruleIds.filter(id => id.startsWith('RF-7-'))
                        },
                        {
                            id: 'RF-8',
                            label: "Péréquation horizontale",
                            children: ruleIds.filter(id => id.startsWith('RF-8-'))
                        },
                        {
                            id: 'RF-9',
                            label: "Recettes diverses",
                            children: ruleIds.filter(id => id.startsWith('RF-9-'))
                        }
                    ]
                },
                {
                    id: 'RI',
                    label: 'Recettes d’investissement',
                    children: ruleIds
                        .filter(id => id.match(/^RI-\d+/))
                        .concat([
                            {
                                id: 'RI-EM',
                                label: 'Emprunt contracté',
                                children: ruleIds.filter(id => id.startsWith('RI-EM-'))
                            }
                        ])
                }
            ]
        },

        {
            id: EXPENDITURES,
            label: 'Dépenses',
            children: [
                {
                    id: 'DF',
                    label: 'Dépenses de fonctionnement',
                    children: [
                        {
                            id: 'DF-1',
                            label: "Actions sociales par prestations",
                            children: [
                                {
                                    id: 'DF-1-1',
                                    label: "Frais d'hébergement",
                                    children: ruleIds.filter(id => id.startsWith('DF-1-1-'))
                                },
                                'DF-1-2',
                                'DF-1-3',
                                'DF-1-4',
                                'DF-1-5',
                                'DF-1-6',
                                {
                                    id: 'DF-1-7',
                                    label: "Autre social",
                                    children: ruleIds.filter(id => id.startsWith('DF-1-7-'))
                                }
                            ]
                        },
                        {
                            id: 'DF-2',
                            label: "Actions sociales par publics",
                            children: ruleIds.filter(id => id.startsWith('DF-2-'))
                        },
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
                                {
                                    id: 'DF-3-7',
                                    label: "Frais de personnel",
                                    children: ruleIds.filter(id => id.startsWith('DF-3-7-'))
                                }

                            ]
                        },
                        'DF-4',
                        'DF-5',
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
                            children: ruleIds.filter(id => id.startsWith('DF-7-'))
                        }
                    ]
                },
                {
                    id: 'DI',
                    label: 'Dépenses d’investissement',
                    children: [
                        {
                            id: 'DI-1',
                            label: "Equipements Propres",
                            children: ruleIds.filter(id => id.startsWith('DI-1-'))
                        },
                        {
                            id: 'DI-2',
                            label: "Subventions",
                            children: ruleIds.filter(id => id.startsWith('DI-2-'))
                        },
                        {
                            id: 'DI-EM',
                            label: 'Emprunt remboursé',
                            children: ruleIds.filter(id => id.startsWith('DI-EM-'))
                        }
                    ]
                }
            ]
        }
    ]
};


const AggregatedNodeRecord = new Record({
    id: undefined,
    label: undefined,
    ownValue: undefined,
    total: undefined,
    children: undefined,
    elements: undefined
})



/**
 * rows : ImmutableSet<Record<AggEntry>>
 */
export default function (aggRows) {

    function makeCorrespondingSubtree(sourceNode) {
        const correspondingTargetNode = {
            id: sourceNode.id,
            label: sourceNode.label,
            ownValue: 0,
            total: 0,
        };
        const children = new Set();
        const elements = new Set();

        // build the tree first
        sourceNode.children.forEach(child => {
            
            if (typeof child === 'string') {
                // aggRows.find over all tree nodes is O(n²)
                const childRow = aggRows.find(r => r.id === child);
                elements.add(childRow);

                children.add(AggregatedNodeRecord({
                    id: child,
                    label: childRow['Libellé'],
                    ownValue: childRow["Montant"],
                    total: childRow["Montant"],
                    elements: new ImmutableSet([childRow])
                }));
            }
            else {
                children.add(makeCorrespondingSubtree(child));
            }
        });

        correspondingTargetNode.children = List(children);

        // then compute elements
        children.forEach(child => {
            child.elements.forEach(e => elements.add(e));
        });
        correspondingTargetNode.elements = ImmutableSet(elements);

        // total amount is computed off of the set of m52 row considered (this helps prevent mistakes due to duplicates)
        let targetNodeM52Rows = new ImmutableSet(elements).map(e => e['M52Rows'])
            .reduce(((acc, rows) => acc.union(rows)), new ImmutableSet())

        // For now, weighted rows are only in DF1, so let's keep things simple
        const weightedRows = targetNodeM52Rows.filter(r => r.weight);

        const weightedById = new Map();
        weightedRows.forEach(r => {
            const id = makeM52RowId(r);

            let elements = weightedById.get(id);
            if(!elements){
                elements = [];
            }
            elements.push(r);
            weightedById.set(id, elements);
        });

        weightedById.forEach((elements, id) => {
            const total = sum(elements.map(r => r['Montant']*r.weight))
            const correspondingUnweighted = targetNodeM52Rows.find(r => makeM52RowId(r) === id);
            
            if(correspondingUnweighted['Montant'] - total <= 0.01){
                elements.forEach(e => {
                    targetNodeM52Rows = targetNodeM52Rows.remove(e)
                })
            }
        });

        correspondingTargetNode.total = targetNodeM52Rows.reduce(
            ((acc, e) => (acc + (e.weight ? e.weight*e["Montant"] : e["Montant"]))), 
            0
        );

        return AggregatedNodeRecord(correspondingTargetNode);
    }

    return makeCorrespondingSubtree(levels);
}