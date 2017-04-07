import memoize from 'lodash.memoize';

import _hierarchicalM52 from './hierarchicalM52.js';
import _hierarchicalAggregated from './hierarchicalAggregated.js';
import _m52ToAggregated from './m52ToAggregated.js';

import objectId from '../objectId';

function hierarchMemoizeResolver(o, rdfi, view){
    return objectId(o) + rdfi.rd + rdfi.fi + (view ? view : '');
}

export const hierarchicalM52 = memoize(_hierarchicalM52, hierarchMemoizeResolver);
export const hierarchicalAggregated = memoize(_hierarchicalAggregated, hierarchMemoizeResolver);
export const m52ToAggregated = memoize(_m52ToAggregated);