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
      result[i] = iteratee(collection[i], keys[i], collection)
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
      iteratee(collection[i], keys[i], collection)
    }
  }
}

export const merge = (object, ...sources) => {
  for (let i = 0; i < sources.length; i++) {
    recursiveReplace(object, sources[i])
  }

  return object
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
