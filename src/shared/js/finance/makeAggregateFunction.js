import memoize from '../memoize.js'

import makeLigneBudgetFilterFromFormula from '../DocumentBudgetaireQueryLanguage/makeLigneBudgetFilterFromFormula.js'

const SPECIAL_ID = 'S'; // keep in sync with description-agrégation.json

export default memoize(function makeAggregateFunction(aggregationDescription, planDeCompte){

    const aggregationDescriptionNodeToAggregatedDocumentBudgetaireNode = memoize(function(aggregationDescriptionNode, documentBudgetaire, planDeCompte, corrections){
        const {id, name, children, formula} = aggregationDescriptionNode;

        const relevantCorrections = corrections.filter(ligne => ligne.splitFor === aggregationDescriptionNode.id)

        return children ?
            // non-leaf
            {
                id, name, 
                children: Object.values(children)
                    .filter(c => c.id !== SPECIAL_ID) // removing 'Spécial' category
                    .map(n => aggregationDescriptionNodeToAggregatedDocumentBudgetaireNode(
                        n, documentBudgetaire, planDeCompte, corrections
                    ))
            } :
            // leaf, has .formula
            {
                id, name, 
                elements: [...documentBudgetaire.rows]
                    .filter(makeLigneBudgetFilterFromFormula(formula, planDeCompte))
                    .concat(relevantCorrections)
            }
    });

    return memoize(function aggregate(docBudg, corrections){
        const yearCorrections = (corrections || []).filter(ligne => ligne.Exer === docBudg.Exer)

        return aggregationDescriptionNodeToAggregatedDocumentBudgetaireNode(aggregationDescription, docBudg, planDeCompte, yearCorrections)
    })
})