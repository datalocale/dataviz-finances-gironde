import { sum } from 'd3-array';

import memoize from '../memoize.js'

/*

    An AggregationDescription is a tree-shaped data structure that describes an aggregation
    The leaves contain a "formula" which acts like a filter on a DocumentBudgetaire

interface AggregationDescription extends AggregationDescriptionNode, Readonly<{
    children: Map<id, AggregationDescription | AggregationDescriptionLeaf>
}>{}

interface AggregationDescriptionNode extends Readonly<{
    id: string,
    label: string
}>{}

interface AggregationDescriptionLeaf extends AggregationDescriptionNode, Readonly<{
    formula: string
}>{}

*/

export function AggregationDescriptionToJSON(aggregationDescription){
    const {id, name, useInAnalysis, formula, children} = aggregationDescription

    return children ?
        { id, name, useInAnalysis, children : Object.values(children).map(AggregationDescriptionToJSON) } :
        { id, name, useInAnalysis, formula } ;
}

export function AggregationDescriptionFromJSON(aggregationDescriptionJSON){
    // In older versions, useInAnalysis didn't exist. Setting to true as default value
    const {id, name, useInAnalysis = true, formula, children} = aggregationDescriptionJSON

    return children ?
        { id, name, useInAnalysis, children: Object.fromEntries(children.map(c => [c.id, AggregationDescriptionFromJSON(c)])) } :
        { id, name, useInAnalysis, formula } ;
}


/*
    An AggregatedDocumentBudgetaire is the result of an AggregationDescription applied to a DocumentBudgetaire
    It's a tree-shaped data structures that mirrors the AggregationDescription structure

interface AggregatedDocumentBudgetaire extends AggregationDocumentBudgetaireNode, Readonly<{
    children: OrderedSet<AggregatedDocumentBudgetaire | AggregatedDocumentBudgetaireLeaf>
}>{}

interface AggregationDocumentBudgetaireNode extends Readonly<{
    id: string,
    label: string
}>{}

interface AggregatedDocumentBudgetaireLeaf extends AggregationDocumentBudgetaireNode, Readonly<{
    elements: Set<LigneBudget>
}>{}



interface AggregateMaker {
    (desc: AggregationDescription): 
        (doc: DocumentBudgetaire) => AggregatedDocumentBudgetaire;
}

*/

export function getAggregatedDocumentBudgetaireLeavesToAnalyze(aggregatedDocumentBudgetaire, aggregationDescription){
    return aggregationDescription.useInAnalysis ?
        (aggregatedDocumentBudgetaire.children ?
            Object.values(aggregatedDocumentBudgetaire.children)
                .map(child => getAggregatedDocumentBudgetaireLeavesToAnalyze(child, aggregationDescription.children[child.id]))
                .flat() :
            aggregatedDocumentBudgetaire) :
        []
}

/*
    Function to compute the LigneBudget elements of a given node in the AggregatedDocumentBudgetaire tree
    by making the union of children, recursively
*/

function rawAggregatedDocumentBudgetaireNodeElements(node){
    if(!node.children)
        return node.elements
    else{
        const union = new Set()
    
        for(const child of node.children){
            // When computing the total of DF, ignore everything that's in DF.1
            // There is supposed to be the same amount elements (and amounts) in DF.2
            // Given the same elements, things should cancel out naturally with the fact hat
            // 'union' is a set. But there are split rows which are unique to DF.1 and others to DF.2
            // and they are hard to disambiguate
            if(!(node.id === 'DF' && child.id === 'DF.1')){
                for(const el of aggregatedDocumentBudgetaireNodeElements(child)){
                    union.add(el);
                }
            }
        }

        return union
    }
}

export const aggregatedDocumentBudgetaireNodeElements = memoize(rawAggregatedDocumentBudgetaireNodeElements)

/*
    Function to compute the LigneBudget elements total of a given node in the AggregatedDocumentBudgetaire tree
*/


function rawAggregatedDocumentBudgetaireNodeTotal(node){
    // [...arr] is carefully placed so the result stops being a Set *before* the .map
    // if the .map was done before the [...arr], similar amounts would be counted only once leading
    // to an incorrect sum
    
    return sum([...aggregatedDocumentBudgetaireNodeElements(node)].map(row => row['MtReal']))
}

export const aggregatedDocumentBudgetaireNodeTotal = memoize(rawAggregatedDocumentBudgetaireNodeTotal)