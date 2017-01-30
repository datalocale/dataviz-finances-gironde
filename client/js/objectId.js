import memoize from 'lodash.memoize';
import uuid from 'uuid';

const Cache = memoize.Cache
memoize.Cache = WeakMap;
const ret = memoize(o => uuid());
memoize.Cache = Cache;

export default ret;