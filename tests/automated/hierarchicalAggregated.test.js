import * as matchers from 'jest-immutable-matchers';
import {OrderedSet as ImmutableSet} from 'immutable';
import hierarchicalAggregated from '../../src/shared/js/finance/hierarchicalAggregated';
import m52ToAggregated from '../../src/shared/js/finance/m52ToAggregated';
import {M52RowRecord, M52Instruction} from '../../src/shared/js/finance/M52InstructionDataStructures';
import {PAR_PUBLIC_VIEW} from '../../src/shared/js/finance/constants';
import {flattenTree} from '../../src/shared/js/finance/visitHierarchical.js';


jest.addMatchers(matchers);

const DF = {
    rd: 'D',
    fi: 'F'
};

test('hierarchicalAggregated returns a node when passed dummy valid arguments', () => {
  const AMOUNT = 1037;

  const m52Row = new M52RowRecord({
    'Dépense/Recette': 'D',
    'Investissement/Fonctionnement': 'F',
    'Réel/Ordre id/Ordre diff': 'OR',
    'Chapitre': 'C65',
    'Article': 'A6553',
    'Rubrique fonctionnelle': 'R12',
    'Montant': AMOUNT
  });

  const m52instruction = new M52Instruction({rows: new ImmutableSet([m52Row])});
  const aggregatedVision = m52ToAggregated(m52instruction);
  const rdfi = DF;
  const dfView = PAR_PUBLIC_VIEW;

  const hierAgg = hierarchicalAggregated(aggregatedVision, rdfi, dfView);

  expect(hierAgg.id).toBe('DF');
  expect(hierAgg.ownValue).toBe(0);
  expect(hierAgg.total).toBe(AMOUNT);
  expect(hierAgg.children).toBeInstanceOf(Set);
});

