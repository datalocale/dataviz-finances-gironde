import {readFileSync} from 'fs'
import {join} from 'path'

import * as matchers from 'jest-immutable-matchers';

import {DOMParser} from 'xmldom';

import {fromXMLDocument} from '../../src/shared/js/finance/planDeCompte.js'
import makeAggregateFunction from '../../src/shared/js/finance/makeAggregateFunction.js'
import xmlDocumentToDocumentBudgetaire from '../../src/shared/js/finance/xmlDocumentToDocumentBudgetaire';
import {aggregatedDocumentBudgetaireNodeTotal} from '../../src/shared/js/finance/AggregationDataStructures';
import {flattenTree} from '../../src/shared/js/finance/visitHierarchical';
import csvStringToCorrections from '../../src/shared/js/finance/csvStringToCorrections';

import aggregationDescription from '../../data/finances/description-agrégation.json'

import { EXPENDITURES, REVENUE, DF, RF, RI, DI } from '../../src/shared/js/finance/constants';

jest.addMatchers(matchers);

function pathToXMLDocument(path){
    const planDeCompteXMLString = readFileSync(path, {encoding: 'utf-8'} )
    return (new DOMParser()).parseFromString(planDeCompteXMLString, "text/xml");
}

const planDeCompte = fromXMLDocument(
    pathToXMLDocument(join(__dirname, '..', '..', 'data', 'finances', 'plansDeCompte', 'plan-de-compte-M52-M52-2016.xml'))
)

const CA2016 = xmlDocumentToDocumentBudgetaire(
    pathToXMLDocument(join(__dirname, '..', '..', 'data', 'finances', 'CA', 'CA2016BPAL.xml'))
)

const corrections = csvStringToCorrections(readFileSync(join(__dirname, '../../data/finances/corrections-agregation.csv'), {encoding: 'utf-8'}))

const aggregate = makeAggregateFunction(aggregationDescription, planDeCompte)
const aggregated2016Elements = flattenTree(aggregate(CA2016, corrections));




const MILLION = 1000000;

/**
 * RI
 */

test(`Pour le CA 2016 de la Gironde, RI.EM.1 devrait représenter ~57,8 millions d'euros`, () => {
    const riem1 = aggregated2016Elements.find(e => e.id === 'RI.EM.1')

    expect(aggregatedDocumentBudgetaireNodeTotal(riem1)/MILLION).toBeCloseTo(57800000/MILLION, 1);
});

test(`Pour le CA 2016 de la Gironde, RI.1 devrait représenter ~19,6 millions d'euros`, () => {
    const ri1 = aggregated2016Elements.find(e => e.id === 'RI.1')

    expect(aggregatedDocumentBudgetaireNodeTotal(ri1)/MILLION).toBeCloseTo(19600000/MILLION, 1);
});

test(`Pour le CA 2016 de la Gironde, RI devrait représenter ~107,3 millions d'euros`, () => {
    const ri = aggregated2016Elements.find(e => e.id === RI)

    expect(aggregatedDocumentBudgetaireNodeTotal(ri)/MILLION).toBeCloseTo(107300000/MILLION, 1);
});


/**
 * DI
 */

test(`Pour le CA 2016 de la Gironde, DI.2.4 devrait représenter ~10,53 millions d'euros`, () => {
    const df24 = aggregated2016Elements.find(e => e.id === 'DI.2.4')

    expect(aggregatedDocumentBudgetaireNodeTotal(df24)/MILLION).toBeCloseTo(10530000/MILLION, 1);
});

test(`Pour le CA 2016 de la Gironde, DI.EM.1 devrait représenter ~37,9 millions d'euros`, () => {
    const dfem1 = aggregated2016Elements.find(e => e.id === 'DI.EM.1')

    expect(aggregatedDocumentBudgetaireNodeTotal(dfem1)/MILLION).toBeCloseTo(37900000/MILLION, 1);
});

test(`Pour le CA 2016 de la Gironde, DI devrait représenter ~244,9 millions d'euros`, () => {
    const di = aggregated2016Elements.find(e => e.id === DI)

    expect(aggregatedDocumentBudgetaireNodeTotal(di)/MILLION).toBeCloseTo(244900000/MILLION, 1);
});


/**
 * RF
 */

test(`Pour le CA 2016 de la Gironde, RF.5.1 devrait représenter ~150,1 millions d'euros`, () => {
    const rf51 = aggregated2016Elements.find(e => e.id === 'RF.5.1')

    expect(aggregatedDocumentBudgetaireNodeTotal(rf51)/MILLION).toBeCloseTo(150100000/MILLION, 1);
});

test(`Pour le CA 2016 de la Gironde, RF.1.1 devrait représenter ~325,1 millions d'euros`, () => {
    const rf11 = aggregated2016Elements.find(e => e.id === 'RF.1.1')

    expect(aggregatedDocumentBudgetaireNodeTotal(rf11)/MILLION).toBeCloseTo(325100000/MILLION, 1);
});

test(`Pour le CA 2016 de la Gironde, RF devrait représenter ~1527,4 millions d'euros`, () => {
    const rf = aggregated2016Elements.find(e => e.id === RF)

    expect(aggregatedDocumentBudgetaireNodeTotal(rf)/MILLION).toBeCloseTo(1527400000/MILLION, 1);
});

/**
 * DF
 */

test(`Pour le CA 2016 de la Gironde, DF.3 devrait représenter ~220,8 millions d'euros`, () => {
    const df1 = aggregated2016Elements.find(e => e.id === 'DF.3')

    expect(aggregatedDocumentBudgetaireNodeTotal(df1)/MILLION).toBeCloseTo(220800000/MILLION, 1);
});

test(`Pour le CA 2016 de la Gironde, DF.4 devrait représenter ~212,4 millions d'euros`, () => {
    const df1 = aggregated2016Elements.find(e => e.id === 'DF.4')

    expect(aggregatedDocumentBudgetaireNodeTotal(df1)/MILLION).toBeCloseTo(212400000/MILLION, 1);
});

test(`Pour le CA 2016 de la Gironde, DF.5 devrait représenter ~35,1 millions d'euros`, () => {
    const df1 = aggregated2016Elements.find(e => e.id === 'DF.5')

    expect(aggregatedDocumentBudgetaireNodeTotal(df1)/MILLION).toBeCloseTo(35100000/MILLION, 1);
});

test(`Pour le CA 2016 de la Gironde, DF.6.1.1 devrait représenter ~4,5 millions d'euros`, () => {
    const df1 = aggregated2016Elements.find(e => e.id === 'DF.6.1.1')

    expect(aggregatedDocumentBudgetaireNodeTotal(df1)/MILLION).toBeCloseTo(4500000/MILLION, 1);
});

test(`Pour le CA 2016 de la Gironde, DF.6.1.2 devrait représenter ~14,35 millions d'euros`, () => {
    const df1 = aggregated2016Elements.find(e => e.id === 'DF.6.1.2')

    expect(aggregatedDocumentBudgetaireNodeTotal(df1)/MILLION).toBeCloseTo(14350000/MILLION, 1);
});

test(`Pour le CA 2016 de la Gironde, DF.6.1.3 devrait représenter ~13,22 millions d'euros`, () => {
    const df1 = aggregated2016Elements.find(e => e.id === 'DF.6.1.3')

    expect(aggregatedDocumentBudgetaireNodeTotal(df1)/MILLION).toBeCloseTo(13220000/MILLION, 1);
});

test(`Pour le CA 2016 de la Gironde, DF.6.1.4 devrait représenter ~232590 d'euros`, () => {
    const df1 = aggregated2016Elements.find(e => e.id === 'DF.6.1.4')

    expect(aggregatedDocumentBudgetaireNodeTotal(df1)/MILLION).toBeCloseTo(235000/MILLION, 4);
});

test(`Pour le CA 2016 de la Gironde, DF.6.1 devrait représenter ~32,35 millions d'euros`, () => {
    const df1 = aggregated2016Elements.find(e => e.id === 'DF.6.1')

    expect(aggregatedDocumentBudgetaireNodeTotal(df1)/MILLION).toBeCloseTo(32350000/MILLION, 1);
});

test(`Pour le CA 2016 de la Gironde, DF.6 devrait représenter ~49.09 millions d'euros`, () => {
    const df1 = aggregated2016Elements.find(e => e.id === 'DF.6')

    expect(aggregatedDocumentBudgetaireNodeTotal(df1)/MILLION).toBeCloseTo(49090000/MILLION, 1);
});

test(`Pour le CA 2016 de la Gironde, DF.7 devrait représenter ~16,3 millions d'euros`, () => {
    const df1 = aggregated2016Elements.find(e => e.id === 'DF.7')

    expect(aggregatedDocumentBudgetaireNodeTotal(df1)/MILLION).toBeCloseTo(16300000/MILLION, 1);
});

test(`Pour le CA 2016 de la Gironde, DF.2.2 devrait représenter ~207,3 millions d'euros`, () => {
    const df1 = aggregated2016Elements.find(e => e.id === 'DF.2.2')

    expect(aggregatedDocumentBudgetaireNodeTotal(df1)/MILLION).toBeCloseTo(207300000/MILLION, 1);
});

test(`Pour le CA 2016 de la Gironde, DF.1.4 devrait représenter ~141,7 millions d'euros`, () => {
    const df1 = aggregated2016Elements.find(e => e.id === 'DF.1.4')

    expect(aggregatedDocumentBudgetaireNodeTotal(df1)/MILLION).toBeCloseTo(141700000/MILLION, 1);
});

test(`Pour le CA 2016 de la Gironde, DF.1 devrait représenter ~841 millions d'euros`, () => {
    const df1 = aggregated2016Elements.find(e => e.id === 'DF.1')

    expect(aggregatedDocumentBudgetaireNodeTotal(df1)/MILLION).toBeCloseTo(840850000/MILLION, 1);
});

test(`Pour le CA 2016 de la Gironde, DF.2 devrait représenter ~841 millions d'euros`, () => {
    const df2 = aggregated2016Elements.find(e => e.id === 'DF.2')

    expect(aggregatedDocumentBudgetaireNodeTotal(df2)/MILLION).toBeCloseTo(840850000/MILLION, 1);
});

test(`Pour le CA 2016 de la Gironde, DF.1 = DF.2`, () => {
    const df1 = aggregated2016Elements.find(e => e.id === 'DF.1')
    const df2 = aggregated2016Elements.find(e => e.id === 'DF.2')

    expect(aggregatedDocumentBudgetaireNodeTotal(df1)).toBeCloseTo(aggregatedDocumentBudgetaireNodeTotal(df2), 1);
});

test(`Pour le CA 2016 de la Gironde, DF devrait représenter ~1375,6 millions d'euros`, () => {
    const df = aggregated2016Elements.find(e => e.id === DF);

    expect(aggregatedDocumentBudgetaireNodeTotal(df)/MILLION).toBeCloseTo(1375600000/MILLION, 1);
});

/**
 * D & R
 */

test(`Pour le CA 2016 de la Gironde, D devrait représenter ~1620,5 millions d'euros`, () => {
    const D = aggregated2016Elements.find(e => e.id === EXPENDITURES);

    expect(aggregatedDocumentBudgetaireNodeTotal(D)/MILLION).toBeCloseTo(1620500000/MILLION, 1);
});

test(`Pour le CA 2016 de la Gironde, R devrait représenter ~1634,8 millions d'euros`, () => {
    const R = aggregated2016Elements.find(e => e.id === REVENUE);

    expect(aggregatedDocumentBudgetaireNodeTotal(R)/MILLION).toBeCloseTo(1634800000/MILLION, 1);
});

/**
 * Corrections
 */

function isSplitRow(r){
    return r['Nature'] === '65111' && r['Fonction'] === '51';
}

test('Pour le CA 2016 de la Gironde, la ligne DF 51 65111 est présente dans DF.1.1.3 à 75% et DF.1.5 à 25%', () => {
    const df113 = aggregated2016Elements.find(e => e.id === 'DF.1.1.3')
    const splitRow113 = [...df113.elements].find(isSplitRow);

    const df15 = aggregated2016Elements.find(e => e.id === 'DF.1.5')
    const splitRow15 = [...df15.elements].find(isSplitRow);
    
    expect(splitRow113).toBeDefined();
    expect(splitRow113['MtReal']).toBe(12483401.83);
    
    expect(splitRow15).toBeDefined();
    expect(splitRow15['MtReal']).toBe(4084422.79);
});


test('Pour le CA 2016 de la Gironde, la ligne DF 51 65111 est présente dans DF.2.4', () => {
    const df24 = aggregated2016Elements.find(e => e.id === 'DF.2.4')
    const splitRow = [...df24.elements].find(isSplitRow);
    
    expect(splitRow).toBeDefined();
    expect(splitRow.weight).toBeUndefined();
});
