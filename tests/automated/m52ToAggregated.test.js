import * as matchers from 'jest-immutable-matchers';
import {OrderedSet as ImmutableSet} from 'immutable';
import m52ToAggregated from '../../client/js/finance/m52ToAggregated';
import {M52RowRecord, M52Instruction} from '../../client/js/finance/M52InstructionDataStructures';

const AGGREGATED_ROWS_COUNT = 89;

jest.addMatchers(matchers);

test('m52ToAggregated returns an OrderedSet', () => {
  const instruction = new M52Instruction({rows: new ImmutableSet()});
  expect(m52ToAggregated(instruction)).toBeImmutableOrderedSet();
});

test('m52ToAggregated returns an OrderedSet of one DF-3-1 element with same amount when passed an instruction with only DF C65 R12 A6553', () => {
  const AMOUNT = 1037;
  const expectedAggId = 'DF-3-1';
  const m52Row = new M52RowRecord({
    'Dépense/Recette': 'D',
    'Investissement/Fonctionnement': 'F',
    'Réel/Ordre id/Ordre diff': 'OR',
    'Chapitre': 'C65',
    'Article': 'A6553',
    'Rubrique fonctionnelle': 'R12',
    'Montant': AMOUNT
  })
  const instruction = new M52Instruction({rows: new ImmutableSet([m52Row])});

  const aggVision = m52ToAggregated(instruction);
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