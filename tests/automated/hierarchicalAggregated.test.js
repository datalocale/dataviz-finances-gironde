import {readFileSync} from 'fs';
import {resolve} from 'path';

import * as matchers from 'jest-immutable-matchers';
import { OrderedSet as ImmutableSet } from 'immutable';
import hierarchicalAggregated from '../../src/shared/js/finance/hierarchicalAggregated';
import csvStringToCorrections from '../../src/shared/js/finance/csvStringToCorrections';
import m52ToAggregated from '../../src/shared/js/finance/m52ToAggregated';
import { M52RowRecord, M52Instruction } from '../../src/shared/js/finance/M52InstructionDataStructures';
import { EXPENDITURES } from '../../src/shared/js/finance/constants';
import { flattenTree } from '../../src/shared/js/finance/visitHierarchical';

const corrections = csvStringToCorrections(readFileSync(resolve(__dirname, '../../data/finances/corrections-agregation.csv'), {encoding: 'utf-8'}))

jest.addMatchers(matchers);

test('hierarchicalAggregated returns a node when passed dummy valid arguments', () => {
    const AMOUNT = 1037;

    // DF-3-1
    const m52Row = new M52RowRecord({
        'Dépense/Recette': 'D',
        'Investissement/Fonctionnement': 'F',
        'Réel/Ordre id/Ordre diff': 'OR',
        'Chapitre': 'C65',
        'Article': 'A6553',
        'Rubrique fonctionnelle': 'R12',
        'Montant': AMOUNT
    });

    const m52instruction = new M52Instruction({ rows: new ImmutableSet([m52Row]) }, corrections);
    const aggregatedVision = m52ToAggregated(m52instruction);

    const hierAgg = hierarchicalAggregated(aggregatedVision);

    expect(hierAgg.id).toBe('Total');
    expect(hierAgg.ownValue).toBe(0);
    expect(hierAgg.total).toBe(AMOUNT);
    expect(hierAgg.children).toBeImmutableList();
});


test('a row that appears in both DF-1 and DF-2 should be counted only once in total expenditures', () => {
    const AMOUNT = 1037;

    const solidarityM52Row = new M52RowRecord({
        'Dépense/Recette': 'D',
        'Investissement/Fonctionnement': 'F',
        'Réel/Ordre id/Ordre diff': 'OR',
        'Chapitre': 'C65',
        'Article': 'A652412',
        'Rubrique fonctionnelle': 'R51',
        'Montant': AMOUNT
    });

    const m52instruction = new M52Instruction({ rows: new ImmutableSet([solidarityM52Row]) });
    const aggregatedVision = m52ToAggregated(m52instruction, corrections);

    const hierAgg = hierarchicalAggregated(aggregatedVision);
    
    const hierAggList = flattenTree(hierAgg)

    const df1 = hierAggList.find(c => c.id === 'DF-1');
    const df2 = hierAggList.find(c => c.id === 'DF-2');

    const expenditures = [...hierAgg.children].find(c => c.id === EXPENDITURES);

    expect(df1.total).toBe(AMOUNT);
    expect(df2.total).toBe(AMOUNT);
    expect(expenditures.total).toBe(AMOUNT);
});

