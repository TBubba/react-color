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
