import {Set as ImmutableSet} from 'immutable'

import {readFileSync} from 'fs'
import {join} from 'path'

import * as matchers from 'jest-immutable-matchers';

import { DocumentBudgetaire, LigneBudgetRecord } from '../../src/shared/js/finance/DocBudgDataStructures';
import hierarchicalAggregated from '../../src/shared/js/finance/hierarchicalAggregated';
import m52ToAggregated from '../../src/shared/js/finance/m52ToAggregated';
import csvStringToCorrections from '../../src/shared/js/finance/csvStringToCorrections.js';

import { flattenTree } from '../../src/shared/js/finance/visitHierarchical';
import { EXPENDITURES, REVENUE, DF, RF, RI, DI } from '../../src/shared/js/finance/constants';

const corrections = csvStringToCorrections(readFileSync(join(__dirname, '../../data/finances/corrections-agregation.csv'), {encoding: 'utf-8'}))

jest.addMatchers(matchers);

const docBudgs = require('../../build/finances/doc-budgs.json').map(d => {
    d.rows = new ImmutableSet( d.rows.map(LigneBudgetRecord) )
    return DocumentBudgetaire(d)
});
const docBudg2016 = docBudgs.find(db => db['Exer'] === 2016);
//console.log('2016', docBudg2016);

const aggregated2016 = m52ToAggregated(docBudg2016, corrections);
const hierAgg2016 = hierarchicalAggregated(aggregated2016);

const hierAgg2016Elements = flattenTree(hierAgg2016);

function isSplitRow(r){
    return r['Nature'] === '65111' && r['Fonction'] === '51';
}

const MILLION = 1000000;

/**
 * RI
 */

test(`Pour le CA 2016 de la Gironde, RI-EM-1 devrait représenter ~57,8 millions d'euros`, () => {
    const df1 = hierAgg2016Elements.find(e => e.id === 'RI-EM-1')

    expect(df1.total/MILLION).toBeCloseTo(57800000/MILLION, 1);
});

test(`Pour le CA 2016 de la Gironde, RI-1 devrait représenter ~19,6 millions d'euros`, () => {
    const df1 = hierAgg2016Elements.find(e => e.id === 'RI-1')

    expect(df1.total/MILLION).toBeCloseTo(19600000/MILLION, 1);
});

test(`Pour le CA 2016 de la Gironde, RI devrait représenter ~107,3 millions d'euros`, () => {
    const df1 = hierAgg2016Elements.find(e => e.id === RI)

    expect(df1.total/MILLION).toBeCloseTo(107300000/MILLION, 1);
});


/**
 * DI
 */

test(`Pour le CA 2016 de la Gironde, DI-2-4 devrait représenter ~10,6 millions d'euros`, () => {
    const df1 = hierAgg2016Elements.find(e => e.id === 'DI-2-4')

    expect(df1.total/MILLION).toBeCloseTo(10600000/MILLION, 1);
});

test(`Pour le CA 2016 de la Gironde, DI-EM-1 devrait représenter ~37,9 millions d'euros`, () => {
    const df1 = hierAgg2016Elements.find(e => e.id === 'DI-EM-1')

    expect(df1.total/MILLION).toBeCloseTo(37900000/MILLION, 1);
});

test(`Pour le CA 2016 de la Gironde, DI devrait représenter ~244,9 millions d'euros`, () => {
    const df1 = hierAgg2016Elements.find(e => e.id === DI)

    expect(df1.total/MILLION).toBeCloseTo(244900000/MILLION, 1);
});


/**
 * RF
 */

test(`Pour le CA 2016 de la Gironde, RF-5-1 devrait représenter ~150,1 millions d'euros`, () => {
    const df1 = hierAgg2016Elements.find(e => e.id === 'RF-5-1')

    expect(df1.total/MILLION).toBeCloseTo(150100000/MILLION, 1);
});

test(`Pour le CA 2016 de la Gironde, RF-1-1 devrait représenter ~325,1 millions d'euros`, () => {
    const df1 = hierAgg2016Elements.find(e => e.id === 'RF-1-1')

    expect(df1.total/MILLION).toBeCloseTo(325100000/MILLION, 1);
});

test(`Pour le CA 2016 de la Gironde, RF devrait représenter ~1527,4 millions d'euros`, () => {
    const df1 = hierAgg2016Elements.find(e => e.id === RF)

    expect(df1.total/MILLION).toBeCloseTo(1527400000/MILLION, 1);
});

/**
 * DF
 */

test(`Pour le CA 2016 de la Gironde, DF-3 devrait représenter ~221,0 millions d'euros`, () => {
    const df1 = hierAgg2016Elements.find(e => e.id === 'DF-3')

    expect(df1.total/MILLION).toBeCloseTo(221000000/MILLION, 1);
});

test(`Pour le CA 2016 de la Gironde, DF-4 devrait représenter ~212,4 millions d'euros`, () => {
    const df1 = hierAgg2016Elements.find(e => e.id === 'DF-4')

    expect(df1.total/MILLION).toBeCloseTo(212400000/MILLION, 1);
});

test(`Pour le CA 2016 de la Gironde, DF-5 devrait représenter ~35,1 millions d'euros`, () => {
    const df1 = hierAgg2016Elements.find(e => e.id === 'DF-5')

    expect(df1.total/MILLION).toBeCloseTo(35100000/MILLION, 1);
});

test(`Pour le CA 2016 de la Gironde, DF-6-1-1 devrait représenter ~4,5 millions d'euros`, () => {
    const df1 = hierAgg2016Elements.find(e => e.id === 'DF-6-1-1')

    expect(df1.total/MILLION).toBeCloseTo(4500000/MILLION, 1);
});

test(`Pour le CA 2016 de la Gironde, DF-6-1-2 devrait représenter ~15,3 millions d'euros`, () => {
    const df1 = hierAgg2016Elements.find(e => e.id === 'DF-6-1-2')

    expect(df1.total/MILLION).toBeCloseTo(15300000/MILLION, 1);
});

test(`Pour le CA 2016 de la Gironde, DF-6-1-3 devrait représenter ~12,6 millions d'euros`, () => {
    const df1 = hierAgg2016Elements.find(e => e.id === 'DF-6-1-3')

    expect(df1.total/MILLION).toBeCloseTo(12600000/MILLION, 1);
});

test(`Pour le CA 2016 de la Gironde, DF-6-1-4 devrait représenter ~232590 d'euros`, () => {
    const df1 = hierAgg2016Elements.find(e => e.id === 'DF-6-1-4')

    expect(df1.total/MILLION).toBeCloseTo(235000/MILLION, 4);
});

test(`Pour le CA 2016 de la Gironde, DF-6-1 devrait représenter ~32,6 millions d'euros`, () => {
    const df1 = hierAgg2016Elements.find(e => e.id === 'DF-6-1')

    expect(df1.total/MILLION).toBeCloseTo(32600000/MILLION, 1);
});

test(`Pour le CA 2016 de la Gironde, DF-6 devrait représenter ~50 millions d'euros`, () => {
    const df1 = hierAgg2016Elements.find(e => e.id === 'DF-6')

    expect(df1.total/MILLION).toBeCloseTo(50000000/MILLION, 1);
});

test(`Pour le CA 2016 de la Gironde, DF-7 devrait représenter ~16,3 millions d'euros`, () => {
    const df1 = hierAgg2016Elements.find(e => e.id === 'DF-7')

    expect(df1.total/MILLION).toBeCloseTo(16300000/MILLION, 1);
});

test(`Pour le CA 2016 de la Gironde, DF-2-2 devrait représenter ~207,3 millions d'euros`, () => {
    const df1 = hierAgg2016Elements.find(e => e.id === 'DF-2-2')

    expect(df1.total/MILLION).toBeCloseTo(207300000/MILLION, 1);
});

test(`Pour le CA 2016 de la Gironde, DF-1-4 devrait représenter ~141,7 millions d'euros`, () => {
    const df1 = hierAgg2016Elements.find(e => e.id === 'DF-1-4')

    expect(df1.total/MILLION).toBeCloseTo(141700000/MILLION, 1);
});

test(`Pour le CA 2016 de la Gironde, DF-1 devrait représenter ~841 millions d'euros`, () => {
    const df1 = hierAgg2016Elements.find(e => e.id === 'DF-1')

    expect(df1.total/MILLION).toBeCloseTo(840850000/MILLION, 1);
});

test(`Pour le CA 2016 de la Gironde, DF-2 devrait représenter ~841 millions d'euros`, () => {
    const df2 = hierAgg2016Elements.find(e => e.id === 'DF-2')

    expect(df2.total/MILLION).toBeCloseTo(840850000/MILLION, 1);
});

test(`Pour le CA 2016 de la Gironde, DF-1 = DF-2`, () => {
    const df1 = hierAgg2016Elements.find(e => e.id === 'DF-1')
    const df2 = hierAgg2016Elements.find(e => e.id === 'DF-2')

    expect(df1.total).toBeCloseTo(df2.total, 1);
});

test(`Pour le CA 2016 de la Gironde, DF devrait représenter ~1375,6 millions d'euros`, () => {
    const df = hierAgg2016Elements.find(e => e.id === DF);

    expect(df.total/MILLION).toBeCloseTo(1375600000/MILLION, 1);
});

/**
 * D & R
 */

test(`Pour le CA 2016 de la Gironde, D devrait représenter ~1620,5 millions d'euros`, () => {
    const df = hierAgg2016Elements.find(e => e.id === EXPENDITURES);

    expect(df.total/MILLION).toBeCloseTo(1620500000/MILLION, 1);
});

test(`Pour le CA 2016 de la Gironde, R devrait représenter ~1634,8 millions d'euros`, () => {
    const df = hierAgg2016Elements.find(e => e.id === REVENUE);

    expect(df.total/MILLION).toBeCloseTo(1634800000/MILLION, 1);
});

/**
 * Corrections
 */

test('Pour le CA 2016 de la Gironde, la ligne DF R51 A65111 est présente dans DF-1-1-3 à 75% et DF-1-5 à 25%', () => {
    const df113 = hierAgg2016Elements.find(e => e.id === 'DF-1-1-3')
    const splitRow113 = df113.elements.first()['M52Rows'].find(isSplitRow);

    const df15 = hierAgg2016Elements.find(e => e.id === 'DF-1-5')
    const splitRow15 = df15.elements.first()['M52Rows'].find(isSplitRow);
    
    expect(splitRow113).toBeDefined();
    expect(splitRow113['MtReal']).toBe(12483401.83);
    
    expect(splitRow15).toBeDefined();
    expect(splitRow15['MtReal']).toBe(4084422.79);
});


test('Pour le CA 2016 de la Gironde, la ligne DF R51 A65111 est présente dans DF-2-4', () => {
    const df24 = hierAgg2016Elements.find(e => e.id === 'DF-2-4')
    const splitRow = df24.elements.first()['M52Rows'].find(isSplitRow);
    
    expect(splitRow).toBeDefined();
    expect(splitRow.weight).toBeUndefined();
});
