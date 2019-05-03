const path = require('path')
const fs = require('fs')

/**
 * convert an iterable of key, value pair arrays to an object, reverses Object.entries(),
 * shim for Object.fromEntries()
 *
 * @param {Iterable<[string, any]>} iter iterable of arrays of key, value pairs
 * @returns {{}} obj with key, value pairs assigned
 */
const ObjectFromEntries = (iter) => {
  const obj = {}
  const arr = [...iter]

  arr.forEach((pair) => {
    if (Object(pair) !== pair) {
      throw new TypeError('iterable for fromEntries should yield objects')
    }

    const { 0: key, 1: val } = pair

    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      writable: true,
      value: val
    })
  })

  return obj
}

/**
 * returns the path to the given package.
 * @param {string} packageName The package name
 * @returns {string} The package path
 */
const getPackagePath = (packageName) => {
  try {
    return path.dirname(require.resolve(`${packageName}/package.json`))
  } catch (e) {
    return null
  }
}

/**
 * Generate new object with sorted keys
 * @param {{}} obj any object
 * @returns {{}} object with sorted keys
 */
const sortKeys = obj => ObjectFromEntries(Object.entries(obj).sort((a, b) => a[0] - b[0]))

/**
 * Generate new object with invalid Semantic-UI-CSS paths removed
 * @param {*} obj any object of dependencies
 * @returns {*} object with valid paths
 */
const filterInvalidPaths = deps => (
  ObjectFromEntries(Object.entries(deps).map(([key, vals]) => [
    key,
    vals.filter(val => deps[val])
  ]))
)

/**
 * Generate new object with entries that have a key that's an invalid Semantic-UI-CSS path removed
 * @param {*} obj any object of dependencies
 * @returns {*} object with valid paths
 */
const filterInvalidKeyPaths = deps => (
  ObjectFromEntries(Object.entries(deps).filter(([key, vals]) => fs.existsSync(`node_modules/semantic-ui-css/components/${key.toLowerCase()}.min.css`)))
)

/**
 * Generate new object with all-depth, local refs resolved
 * if item in val arr match a key in obj, replace with key in obj's value
 * @param {{}} obj any object
 * @returns {{}} object without circular refs
 */
const flattenCircularRefs = obj => (
  ObjectFromEntries(Object.entries(obj).map(([key, val]) => {
    const newVal = new Set(val)

    // avoid functional prog to simplify
    newVal.forEach((ref) => {
      if (obj[ref]) {
        // has key? merge with newVal & keep flattening
        obj[ref].forEach(nested => newVal.add(nested))
      }
    })

    return [key, [...newVal]]
  }))
)

/**
 * write given object to given filepath
 * @param {string} filepath location of file to write to
 * @param {{}} obj content to write to file
 */
const writeObjToFile = (filepath, obj) => {
  fs.writeFileSync(filepath, JSON.stringify(obj, null, 2), 'utf8')
}

module.exports = {
  getPackagePath,
  ObjectFromEntries,
  sortKeys,
  filterInvalidPaths,
  filterInvalidKeyPaths,
  flattenCircularRefs,
  writeObjToFile
}
