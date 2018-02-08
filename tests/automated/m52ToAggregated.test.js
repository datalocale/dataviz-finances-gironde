import * as matchers from 'jest-immutable-matchers';
import { OrderedSet as ImmutableSet } from 'immutable';
import { rules, default as m52ToAggregated } from '../../src/shared/js/finance/m52ToAggregated';
import { LigneBudgetRecord, DocumentBudgetaire } from '../../src/shared/js/finance/DocBudgDataStructures';

const AGGREGATED_ROWS_COUNT = Object.keys(rules).length;

jest.addMatchers(matchers);

test('m52ToAggregated returns an OrderedSet', () => {
    const instruction = new DocumentBudgetaire({ rows: new ImmutableSet() });
    expect(m52ToAggregated(instruction)).toBeImmutableOrderedSet();
});

test('m52ToAggregated returns an OrderedSet of one DF-3-1 element with same amount when passed an instruction with only D 12 6553', () => {
    const AMOUNT = 1037;
    const AGGREGATED_ROW_ID = 'DF-3-1';

    const m52Row = new LigneBudgetRecord({
        'Nature': '6553',
        'Fonction': '12',
        'Chapitre': '65',
        'CodRD': 'D',
        'MtReal': AMOUNT,
        'FI': 'F'
    })
    const instruction = new DocumentBudgetaire({ rows: new ImmutableSet([m52Row]) });

    const aggVision = m52ToAggregated(instruction);
    const aggDF22 = aggVision.filter(row => row.id === AGGREGATED_ROW_ID).first();
    const otherAggRows = aggVision.filter(row => row.id !== AGGREGATED_ROW_ID);

    expect(aggVision).toBeImmutableOrderedSet();
    expect(aggVision.size).toBe(AGGREGATED_ROWS_COUNT);

    expect(aggDF22.id).toEqual(AGGREGATED_ROW_ID);
    expect(aggDF22.M52Rows).toBeImmutableSet();
    expect(aggDF22.M52Rows.first()).toBe(m52Row);
    expect(aggDF22["Montant"]).toBe(AMOUNT);

    otherAggRows.every(r => {
        expect(r["Montant"]).toBe(0);
    });

});