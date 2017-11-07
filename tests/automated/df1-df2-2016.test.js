import {readFileSync} from 'fs'
import {join} from 'path'

import * as matchers from 'jest-immutable-matchers';
import { OrderedSet as ImmutableSet } from 'immutable';

import hierarchicalAggregated from '../../src/shared/js/finance/hierarchicalAggregated';
import m52ToAggregated from '../../src/shared/js/finance/m52ToAggregated';
import { M52RowRecord, M52Instruction } from '../../src/shared/js/finance/M52InstructionDataStructures';
import csvStringToM52Instructions from '../../src/shared/js/finance/csvStringToM52Instructions.js';
import csvStringToCorrections from '../../src/shared/js/finance/csvStringToCorrections.js';

import { flattenTree } from '../../src/shared/js/finance/visitHierarchical';
import { EXPENDITURES, DF } from '../../src/shared/js/finance/constants';

const corrections = csvStringToCorrections(readFileSync(join(__dirname, '../../data/finances/corrections-agregation.csv'), {encoding: 'utf-8'}))

jest.addMatchers(matchers);

const csv2016 = readFileSync(join(__dirname, '../../data/finances/cedi_2016_CA.csv'), {encoding: 'utf-8'});
const docBudg2016 = csvStringToM52Instructions(csv2016);
const aggregated2016 = m52ToAggregated(docBudg2016, corrections);
const hierAgg2016 = hierarchicalAggregated(aggregated2016);

const hierAgg2016Elements = flattenTree(hierAgg2016);

function isSplitRow(r){
    return r['Article'] === 'A65111' && r['Rubrique fonctionnelle'] === 'R51';
}

const MILLION = 1000000;


test('Pour le CA 2016 de la Gironde, la ligne DF R51 A65111 est présente dans DF-1-1-3 à 75% et DF-1-5 à 25%', () => {
    const df113 = hierAgg2016Elements.find(e => e.id === 'DF-1-1-3')
    const splitRow113 = df113.elements.first()['M52Rows'].find(isSplitRow);

    const df15 = hierAgg2016Elements.find(e => e.id === 'DF-1-5')
    const splitRow15 = df15.elements.first()['M52Rows'].find(isSplitRow);
    
    expect(splitRow113).toBeDefined();
    expect(splitRow113['Montant']).toBe(12483401.83);
    
    expect(splitRow15).toBeDefined();
    expect(splitRow15['Montant']).toBe(4084422.79);
});


test('Pour le CA 2016 de la Gironde, la ligne DF R51 A65111 est présente dans DF-2-4', () => {
    const df24 = hierAgg2016Elements.find(e => e.id === 'DF-2-4')
    const splitRow = df24.elements.first()['M52Rows'].find(isSplitRow);
    
    expect(splitRow).toBeDefined();
    expect(splitRow.weight).toBeUndefined();
});


test(`Pour le CA 2016 de la Gironde, DF-1 devrait représenter ~814 millions d'euros`, () => {
    const df1 = hierAgg2016Elements.find(e => e.id === 'DF-1')

    expect(df1.total/MILLION).toBeCloseTo(843560000/MILLION, 1);
});

test(`Pour le CA 2016 de la Gironde, DF-2 devrait représenter ~814 millions d'euros`, () => {
    const df2 = hierAgg2016Elements.find(e => e.id === 'DF-2')

    expect(df2.total/MILLION).toBeCloseTo(843560000/MILLION, 1);
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

test(`Pour le CA 2016 de la Gironde, D devrait représenter ~1620,5 millions d'euros`, () => {
    const df = hierAgg2016Elements.find(e => e.id === EXPENDITURES);

    expect(df.total/MILLION).toBeCloseTo(1620500000/MILLION, 1);
});


