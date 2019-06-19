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
    
    expect(aggregated.children).toHaveLength(2);
});


test('aggregate returns a node when passed simple valid arguments', () => {
    const AMOUNT = 1037;

    // DF.3.1
    const ligneBudget = new LigneBudgetRecord({
        'CodRD': 'D',
        'Nature': '6553',
        'Fonction': '12',
        'MtReal': AMOUNT
    });

    const documentBudgetaire = new DocumentBudgetaire({ rows: new ImmutableSet([ligneBudget]) });
    const aggregated = aggregate(documentBudgetaire)

    expect( aggregated.id ).toBe('racine');
    expect( aggregatedDocumentBudgetaireNodeTotal(aggregated) ).toBe(AMOUNT);
});


test('aggregate returns an AggregatedDocumentBudgetaire of one DF.3.1 element with same amount when passed an DocumentBudgetaire with only D 12 6553', () => {
    const AMOUNT = 1037;
    const AGGREGATED_ROW_ID = 'DF.3.1';

    const ligneBudget = new LigneBudgetRecord({
        'Nature': '6553',
        'Fonction': '12',
        'CodRD': 'D',
        'MtReal': AMOUNT
    })

    const documentBudgetaire = new DocumentBudgetaire({ rows: new ImmutableSet([ligneBudget]) });
    const aggregated = aggregate(documentBudgetaire)

    const aggDF_3_1 = flattenTree(aggregated).find(node => node.id === AGGREGATED_ROW_ID)
    const otherAggregationLeaves = flattenTree(aggregated).filter(node => !node.children && node.id !== AGGREGATED_ROW_ID)

    expect(aggDF_3_1.id).toEqual(AGGREGATED_ROW_ID);
    expect(aggDF_3_1.elements).toBeInstanceOf(Set);
    expect([...aggDF_3_1.elements][0]).toBe(ligneBudget);
    expect( aggregatedDocumentBudgetaireNodeTotal(aggDF_3_1) ).toBe(AMOUNT);

    otherAggregationLeaves.every(n => {
        expect( aggregatedDocumentBudgetaireNodeTotal(n) ).toBe(0);
    });

});


test('A ligneBudget that appears in both DF.1 and DF.2 should be counted only once in total expenditures', () => {
    const AMOUNT = 1038;

    const ligneBudget = new LigneBudgetRecord({
        'CodRD': 'D',
        'Nature': '652412',
        'Fonction': '51',
        'MtReal': AMOUNT
    });

    const documentBudgetaire = new DocumentBudgetaire({ rows: new ImmutableSet([ligneBudget]) });
    const aggregated = aggregate(documentBudgetaire)
    
    const aggregatedNodes = flattenTree(aggregated)

    const df1 = aggregatedNodes.find(n => n.id === 'DF.1');
    const df2 = aggregatedNodes.find(n => n.id === 'DF.2');
    const expenditures = aggregatedNodes.find(n => n.id === 'D');

    expect( aggregatedDocumentBudgetaireNodeTotal(df1) ).toBe(AMOUNT);
    expect( aggregatedDocumentBudgetaireNodeTotal(df2) ).toBe(AMOUNT);
    expect( aggregatedDocumentBudgetaireNodeTotal(expenditures) ).toBe(AMOUNT);
});
