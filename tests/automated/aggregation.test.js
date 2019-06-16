import {readFileSync} from 'fs'
import {join} from 'path'

import * as matchers from 'jest-immutable-matchers';
import { OrderedSet as ImmutableSet } from 'immutable';
import {DOMParser} from 'xmldom';

import {fromXMLDocument} from '../../src/shared/js/finance/planDeCompte.js'
import makeAggregateFunction from '../../src/shared/js/finance/makeAggregateFunction.js'
import { LigneBudgetRecord, DocumentBudgetaire } from '../../src/shared/js/finance/DocBudgDataStructures';
import {flattenTree} from '../../src/shared/js/finance/visitHierarchical';
import {aggregatedDocumentBudgetaireNodeTotal} from '../../src/shared/js/finance/AggregationDataStructures.js'

import aggregationDescription from '../../data/finances/description-agrégation.json'

jest.addMatchers(matchers);

const planDeCompteXMLString = readFileSync(
    join(__dirname, '..', '..', 'data', 'finances', 'plansDeCompte', 'plan-de-compte-M52-M52-2018.xml'),
    'utf8'
)
const planDeCompteXMLDocument = (new DOMParser()).parseFromString(planDeCompteXMLString, "text/xml");
const planDeCompte = fromXMLDocument(planDeCompteXMLDocument)

const aggregate = makeAggregateFunction(aggregationDescription, planDeCompte)

const AGGREGATION_DESCRIPTION_NODE_COUNT = flattenTree(aggregationDescription).length


test('aggregate returns an AggregatedDocumentBudgetaire', () => {
    const documentBudgetaire = new DocumentBudgetaire({ rows: new ImmutableSet() });
    const aggregated = aggregate(documentBudgetaire)
    
    expect(aggregated).toHaveProperty('id');
    expect(aggregated).toHaveProperty('name');
    expect(aggregated).toHaveProperty('children');
    
    expect(aggregated.children).toHaveLength(4);
});

test('m52ToAggregated returns an OrderedSet of one DF-3-1 element with same amount when passed an instruction with only D 12 6553', () => {
    const AMOUNT = 1037;
    const AGGREGATED_ROW_ID = 'DF.3.1';

    const ligneBudget = new LigneBudgetRecord({
        'Nature': '6553',
        'Fonction': '12',
        'Chapitre': '65',
        'CodRD': 'D',
        'MtReal': AMOUNT,
        'FI': 'F'
    })
    const documentBudgetaire = new DocumentBudgetaire({ rows: new ImmutableSet([ligneBudget]) });

    const aggregated = aggregate(documentBudgetaire)

    const aggDF_3_1 = flattenTree(aggregated).find(node => node.id === AGGREGATED_ROW_ID)
    const otherAggregationLeaves = flattenTree(aggregated).filter(node => !node.children && node.id !== AGGREGATED_ROW_ID)

    expect(flattenTree(aggregated).length).toBe(AGGREGATION_DESCRIPTION_NODE_COUNT);

    expect(aggDF_3_1.id).toEqual(AGGREGATED_ROW_ID);
    expect(aggDF_3_1.elements).toBeInstanceOf(Set);
    expect([...aggDF_3_1.elements][0]).toBe(ligneBudget);
    expect( aggregatedDocumentBudgetaireNodeTotal(aggDF_3_1) ).toBe(AMOUNT);

    otherAggregationLeaves.every(n => {
        expect( aggregatedDocumentBudgetaireNodeTotal(n) ).toBe(0);
    });

});