import memoize from 'lodash.memoize';
import uuid from 'uuid';

// for an unknown reason, in IE11, with a WeakMap polyfill as Map, sometimes .set doesn't
// return the map. This leads to memoized.cache being undefined which leads to thrown exceptions
const nativeWeakMap = Object.prototype.toString.call(new WeakMap) === 'WeakMap';
const Cache = memoize.Cache;

if(nativeWeakMap){
    memoize.Cache = WeakMap;
}

const ret = memoize(o => uuid());

if(nativeWeakMap){
    memoize.Cache = Cache;
}

export default ret;