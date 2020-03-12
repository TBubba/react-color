export const map = (collection, iteratee) => {
  let result

  if (Array.isArray(collection)) {
    const length = collection === null ? 0 : collection.length
    result = Array(length)

    for (let i = 0; i < length; i++) {
      result[i] = iteratee(collection[i], i, collection)
    }
  } else {
    const keys = Object.keys(collection)
    result = Array(keys.length)

    for (let i = 0; i < keys.length; i++) {
      result[i] = iteratee(collection[keys[i]], keys[i], collection)
    }
  }

  return result
}

export const each = (collection, iteratee) => {
  if (Array.isArray(collection)) {
    const length = collection === null ? 0 : collection.length

    for (let i = 0; i < length; i++) {
      iteratee(collection[i], i, collection)
    }
  } else {
    const keys = Object.keys(collection)

    for (let i = 0; i < keys.length; i++) {
      iteratee(collection[keys[i]], keys[i], collection)
    }
  }
}

export const merge = (object, ...sources) => {
  for (let i = 0; i < sources.length; i++) {
    recursiveReplace(object, sources[i])
  }

  return object
}

export const reduce = function(collection, iteratee, initialAccumulator) {
  const initAccum = arguments.length < 3
  let accumulator = initialAccumulator

  if (Array.isArray(collection)) {
    let index = -1
    const length = collection === null ? 0 : collection.length

    if (initAccum && length > 0) {
      accumulator = collection[++index]
    }

    while (++index < length) {
      accumulator = iteratee(accumulator, collection[index], index, collection)
    }
  } else {
    let index = -1
    const keys = Object.keys(collection)

    if (initAccum && keys.length > 0) {
      accumulator = collection[keys[++index]]
    }

    while (++index < keys.length) {
      accumulator = iteratee(accumulator, collection[keys[index]], keys[index], collection)
    }
  }

  return accumulator
}

const recursiveReplace = (object, source) => {
  if (!source) {
    return object
  }

  for (const key in source) {
    const objectVal = object[key]
    const sourceVal = source[key]

    if (typeof sourceVal === 'object' && sourceVal !== null &&
        typeof objectVal === 'object' && objectVal !== null) {
      recursiveReplace(objectVal, sourceVal)
    } else if (sourceVal !== undefined) {
      object[key] = sourceVal
    }
  }
}

export const debounce = function(func, initialWait, options) {
  var lastArgs
  var lastThis
  var maxWait
  var result
  var timerId
  var lastCallTime
  var lastInvokeTime = 0
  var leading = false
  var maxing = false
  var trailing = true

  if (typeof func !== 'function') {
    throw new TypeError('Expected a function')
  }

  var wait = parseFloat(initialWait, 10) || 0

  if (typeof options === 'object' && options !== null) {
    leading = !!options.leading // eslint-disable-line no-implicit-coercion
    maxing = 'maxWait' in options
    maxWait = maxing ? Math.max(parseFloat(options.maxWait, 10) || 0, wait) : maxWait
    trailing = 'trailing' in options ? !!options.trailing : trailing // eslint-disable-line no-implicit-coercion
  }

  function invokeFunc(time) { // eslint-disable-line func-style
    var args = lastArgs
    var thisArg = lastThis

    lastArgs = lastThis = undefined // eslint-disable-line no-multi-assign
    lastInvokeTime = time
    result = func.apply(thisArg, args)
    return result
  }

  function leadingEdge(time) { // eslint-disable-line func-style
    // Reset any `maxWait` timer.
    lastInvokeTime = time
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait)
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result
  }

  function remainingWait(time) { // eslint-disable-line func-style
    var timeSinceLastCall = time - lastCallTime
    var timeSinceLastInvoke = time - lastInvokeTime
    var timeWaiting = wait - timeSinceLastCall

    return maxing
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting
  }

  function shouldInvoke(time) { // eslint-disable-line func-style
    var timeSinceLastCall = time - lastCallTime
    var timeSinceLastInvoke = time - lastInvokeTime

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait))
  }

  function timerExpired() { // eslint-disable-line func-style
    var time = Date.now()
    if (shouldInvoke(time)) {
      return trailingEdge(time)
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time))
  }

  function trailingEdge(time) { // eslint-disable-line func-style
    timerId = undefined

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time)
    }
    lastArgs = lastThis = undefined // eslint-disable-line no-multi-assign
    return result
  }

  function cancel() { // eslint-disable-line func-style
    if (timerId !== undefined) {
      clearTimeout(timerId)
    }
    lastInvokeTime = 0
    lastArgs = lastCallTime = lastThis = timerId = undefined // eslint-disable-line no-multi-assign
  }

  // eslint-disable-next-line func-style
  function flush() {
    return timerId === undefined ? result : trailingEdge(Date.now())
  }

  function debounced(...args) { // eslint-disable-line func-style
    var time = Date.now()
    var isInvoking = shouldInvoke(time)

    lastArgs = args
    lastThis = this // eslint-disable-line no-invalid-this
    lastCallTime = time

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime)
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        clearTimeout(timerId)
        timerId = setTimeout(timerExpired, wait)
        return invokeFunc(lastCallTime)
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait)
    }
    return result
  }

  debounced.cancel = cancel
  debounced.flush = flush

  return debounced
}
