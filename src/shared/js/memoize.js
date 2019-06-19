import fastMemoize from 'fast-memoize'

// fast-memoize uses JSON.stringify(arguments) as default serializer
// It doesn't work well with Set/Map/WeakSet/WeakMap which always serialize to '{}'

function Serializer(){
    const objectCounter = new WeakMap()
    let next = 1;

    return function(...args){
        return args.map(arg => {
            if(arg === null || arg === undefined || typeof arg === 'boolean'){
                return String(arg)
            }

            switch(typeof arg){
                case 'number':
                case 'string': {
                    return `${typeof arg}(${arg})`
                }
                case 'object': // null handled above
                case 'symbol': {
                    let id = objectCounter.get(arg);
                    if(id === undefined){
                        id = next;
                        objectCounter.set(arg, id)
                        next++
                    }
                    return id.toString(36);
                }
                default: {
                    console.error('Unhandled type', typeof arg)
                    return 'Ser'+Math.random().toString(36).slice(2)
                }
            }
        }).join(' ')
    }
}

// copy of most useful code of fast-memoize
function isPrimitive (value) {
    return value == null || typeof value === 'number' || typeof value === 'boolean' // || typeof value === "string" 'unsafe' primitive for our needs
}

function monadic (fn, cache, serializer, arg) {
    var cacheKey = isPrimitive(arg) ? arg : serializer(arg)
  
    var computedValue = cache.get(cacheKey)
    if (typeof computedValue === 'undefined') {
      computedValue = fn.call(this, arg)
      cache.set(cacheKey, computedValue)
    }
  
    return computedValue
}

function variadic (fn, cache, serializer, ...args) {
    var cacheKey = serializer(...args)
  
    var computedValue = cache.get(cacheKey)
    if (typeof computedValue === 'undefined') {
      computedValue = fn.apply(this, args)
      cache.set(cacheKey, computedValue)
    }
  
    return computedValue
}

function assemble (fn, context, strategy, cache, serialize) {
    return strategy.bind(
      context,
      fn,
      cache,
      serialize
    )
}

export default function memoize(fn){
    return fastMemoize(fn, {
        serializer: new Serializer(),
        strategy: function strategyDefault (fn, options) {
            var strategy = fn.length === 1 ? monadic : variadic
          
            return assemble(
              fn,
              this,
              strategy,
              options.cache.create(),
              options.serializer
            )
        }
    })
}
