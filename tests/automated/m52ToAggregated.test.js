import * as matchers from 'jest-immutable-matchers';
import {OrderedSet as ImmutableSet} from 'immutable';
import m52ToAggregated from '../../client/js/finance/m52ToAggregated';
import M52RowRecord from '../../client/js/finance/M52RowRecord';

const AGGREGATED_ROWS_COUNT = 89;

jest.addMatchers(matchers);

test('m52ToAggregated returns an OrderedSet', () => {
  expect(m52ToAggregated(new ImmutableSet())).toBeImmutableOrderedSet();
});

test('m52ToAggregated returns an OrderedSet of one DF-7-2 element with same amount when passed an instruction with only DF C011 R0202 A6156', () => {
  const AMOUNT = 1037;
  const expectedAggId = 'DF-7-2';
  const m52Row = new M52RowRecord({
    'Dépense/Recette': 'D',
    'Investissement/Fonctionnement': 'F',
    'Réel/Ordre id/Ordre diff': 'OR',
    'Chapitre': 'C011',
    'Article': 'A6156',
    'Rubrique fonctionnelle': 'R0202',
    'Montant': AMOUNT
  })
  const m52Instruction = ImmutableSet([m52Row]);

  const aggVision = m52ToAggregated(m52Instruction);
  const aggDF22 = aggVision.filter(row => row.id === expectedAggId).first();
  const otherAggRows = aggVision.filter(row => row.id !== expectedAggId);

  expect(aggVision).toBeImmutableOrderedSet();
  expect(aggVision.size).toBe(AGGREGATED_ROWS_COUNT);

  expect(aggDF22.id).toEqual(expectedAggId);
  expect(aggDF22.M52Rows).toBeImmutableSet();
  expect(aggDF22.M52Rows.first()).toBe(m52Row);
  expect(aggDF22["Montant"]).toBe(AMOUNT);

  otherAggRows.every(r => {
    expect(r["Montant"]).toBe(0);
  });

});