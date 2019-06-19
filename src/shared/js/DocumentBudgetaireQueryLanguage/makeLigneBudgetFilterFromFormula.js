import nearley from 'nearley';
import memoize from '../memoize.js'

import grammar from './grammar.js'

function matchesSimple(r, planDeCompte, subset) {

    switch (subset) {
        case 'R':
        case 'D':
            return r['CodRD'] === subset;
        case 'F':
        case 'I':
            return planDeCompte.ligneBudgetFI(r) === subset;
        case 'RF':
        case 'RI':
        case 'DF':
        case 'DI':
            return r['CodRD'] === subset[0] && planDeCompte.ligneBudgetFI(r) === subset[1];
    }

    if (subset.startsWith('Ch'))
        return planDeCompte.ligneBudgetIsInChapitre(r, subset.slice('Ch'.length))

    if (subset.startsWith('C'))
        return planDeCompte.ligneBudgetIsInCompte(r, subset.slice('C'.length))

    if (subset.startsWith('F'))
        return planDeCompte.ligneBudgetIsInFonction(r, subset.slice('F'.length))

    if (subset.startsWith('Ann'))
        return subset.slice('Ann'.length) === String(planDeCompte.Exer)

    console.warn('matchesSubset - Unhandled case', subset);
}

function matchesComplex(r, planDeCompte, combo) {

    if (typeof combo === 'string')
        return matchesSimple(r, planDeCompte, combo);
    
    // assert(Array.isArray(combo))

    const [left, middle, right] = combo;
    
    if (left === '(' && right === ')')
        return matchesComplex(r, planDeCompte, middle)
    else {
        const operator = middle;
    
        switch (operator) {
            case '+':
            case '∪':
                return matchesComplex(r, planDeCompte, left) || matchesComplex(r, planDeCompte, right)
            case '∩':
                return matchesComplex(r, planDeCompte, left) && matchesComplex(r, planDeCompte, right)
            case '-':
                return matchesComplex(r, planDeCompte, left) && !matchesComplex(r, planDeCompte, right)
            default:
                console.warn('matchesSubset - Unhandled case', operator, combo);
        }
    }
    
    console.warn('matchesSubset - Unhandled case', combo);
}

const returnFalseFunction = Object.freeze(() => false);

/*
    returns a function that can be used in the context of a documentBudgetaire.rows.filter()
*/
export default memoize(function makeLigneBudgetFilterFromFormula(formula, planDeCompte) {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

    try{
        parser.feed(formula);

        if(parser.results[0] === undefined)
            return returnFalseFunction
        else
            return memoize(budgetRow => matchesComplex(budgetRow, planDeCompte, parser.results[0]))
    }
    catch(e){
        return returnFalseFunction
    }
})
