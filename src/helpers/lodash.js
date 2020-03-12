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
