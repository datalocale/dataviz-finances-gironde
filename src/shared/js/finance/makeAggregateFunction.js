import memoize from '../memoize.js'

import makeLigneBudgetFilterFromFormula from '../DocumentBudgetaireQueryLanguage/makeLigneBudgetFilterFromFormula.js'

export default memoize(function makeAggregateFunction(aggregationDescription, planDeCompte){

    const aggregationDescriptionNodeToAggregatedDocumentBudgetaireNode = memoize(function(aggregationDescriptionNode, documentBudgetaire, planDeCompte){
        const {id, name, children, formula} = aggregationDescriptionNode;

        return children ?
            // non-leaf
            {
                id, name, 
                children: Object.values(children)
                    .map(n => aggregationDescriptionNodeToAggregatedDocumentBudgetaireNode(
                        n, documentBudgetaire, planDeCompte
                    ))
            } :
            // leaf, has .formula
            {
                id, name, 
                elements: new Set(
                    [...documentBudgetaire.rows]
                        .filter(makeLigneBudgetFilterFromFormula(formula, planDeCompte))
                )
            }
    });

    return memoize(function aggregate(docBudg){
        return aggregationDescriptionNodeToAggregatedDocumentBudgetaireNode(aggregationDescription, docBudg, planDeCompte)
    })
})