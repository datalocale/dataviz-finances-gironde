import memoize from '../memoize';

import _hierarchicalM52 from './hierarchicalM52.js';
import _hierarchicalAggregated from './hierarchicalAggregated.js';
import _m52ToAggregated from './m52ToAggregated.js';

export const hierarchicalM52 = memoize(_hierarchicalM52);
export const hierarchicalAggregated = memoize(_hierarchicalAggregated);
export const m52ToAggregated = memoize(_m52ToAggregated);