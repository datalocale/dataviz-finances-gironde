import * as matchers from 'jest-immutable-matchers';
import {OrderedSet as ImmutableSet} from 'immutable';
import m52ToAggregated from '../../client/js/finance/m52ToAggregated';

jest.addMatchers(matchers);

test('m52ToAggregated returns an OrderedSet', () => {
  expect(m52ToAggregated(new ImmutableSet())).toBeImmutableOrderedSet();
});