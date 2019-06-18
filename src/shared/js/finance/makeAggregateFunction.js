import memoize from '../memoize.js'

import makeLigneBudgetFilterFromFormula from '../DocumentBudgetaireQueryLanguage/makeLigneBudgetFilterFromFormula.js'

export default memoize(function makeAggregateFunction(aggregationDescription, planDeCompte){

    const aggregationDescriptionNodeToAggregatedDocumentBudgetaireNode = memoize(function(aggregationDescriptionNode, documentBudgetaire, planDeCompte, corrections){
        const {id, name, children, formula} = aggregationDescriptionNode;

        const relevantCorrections = corrections.filter(ligne => ligne.splitFor === aggregationDescriptionNode.id)

        if(relevantCorrections.length >= 1)
            console.log('relevantCorrections', aggregationDescriptionNode.id, relevantCorrections)

        return children ?
            // non-leaf
            {
                id, name, 
                children: Object.values(children)
                    .map(n => aggregationDescriptionNodeToAggregatedDocumentBudgetaireNode(
                        n, documentBudgetaire, planDeCompte, corrections
                    ))
            } :
            // leaf, has .formula
            {
                id, name, 
                elements: new Set(
                    [...documentBudgetaire.rows]
                        .filter(makeLigneBudgetFilterFromFormula(formula, planDeCompte))
                        .concat(relevantCorrections)
                )
            }
    });

    return memoize(function aggregate(docBudg, corrections = []){
        corrections = corrections.filter(ligne => ligne.Exer === docBudg.Exer)

        console.log('relevantCorrections', docBudg.Exer, corrections)

        return aggregationDescriptionNodeToAggregatedDocumentBudgetaireNode(aggregationDescription, docBudg, planDeCompte, corrections)
    })
})