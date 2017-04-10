import * as matchers from 'jest-immutable-matchers';
import { OrderedSet as ImmutableSet } from 'immutable';
import hierarchicalAggregated from '../../src/shared/js/finance/hierarchicalAggregated';
import m52ToAggregated from '../../src/shared/js/finance/m52ToAggregated';
import { M52RowRecord, M52Instruction } from '../../src/shared/js/finance/M52InstructionDataStructures';
import {EXPENDITURES, REVENUE } from '../../src/shared/js/finance/constants';

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

    const m52instruction = new M52Instruction({ rows: new ImmutableSet([m52Row]) });
    const aggregatedVision = m52ToAggregated(m52instruction);

    const hierAgg = hierarchicalAggregated(aggregatedVision);

    expect(hierAgg.id).toBe('Total');
    expect(hierAgg.ownValue).toBe(0);
    expect(hierAgg.total).toBe(AMOUNT);
    expect(hierAgg.children).toBeImmutableList();
});


test('with one expenditure in DF-1 and one in DF-2, hierarchicalAggregated returns the correct expenditure total', () => {
    const AMOUNT = 1037;

    const df1M52Row = new M52RowRecord({
        'Dépense/Recette': 'D',
        'Investissement/Fonctionnement': 'F',
        'Réel/Ordre id/Ordre diff': 'OR',
        'Chapitre': 'C0',
        'Article': 'A652221',
        'Rubrique fonctionnelle': 'R5',
        'Montant': AMOUNT
    });
    const df2M52Row = new M52RowRecord({
        'Dépense/Recette': 'D',
        'Investissement/Fonctionnement': 'F',
        'Réel/Ordre id/Ordre diff': 'OR',
        'Chapitre': 'C0',
        'Article': 'A000',
        'Rubrique fonctionnelle': 'R54',
        'Montant': AMOUNT
    });

    const m52instruction = new M52Instruction({ rows: new ImmutableSet([df1M52Row, df2M52Row]) });
    const aggregatedVision = m52ToAggregated(m52instruction);

    const hierAgg = hierarchicalAggregated(aggregatedVision);
    
    const expenditures = [...hierAgg.children].find(c => c.id === EXPENDITURES);

    expect(expenditures.total).toBe(AMOUNT);
});

