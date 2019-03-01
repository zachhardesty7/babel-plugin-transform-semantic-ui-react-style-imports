const path = require('path')
const fs = require('fs')

/**
 * returns the path to the given package.
 * @param packageName The package name
 * @returns {*} The package path
 */
function getPackagePath(packageName) {
  try {
    return path.dirname(require.resolve(`${packageName}/package.json`))
  } catch (e) {
    return null
  }
}

/**
 * Generate new object with sorted keys
 * @param {*} obj any object
 * @returns {*} object with sorted keys
 */
function sortKeys(obj) {
  const ordered = {}
  Object.keys(obj).sort().forEach((key) => {
    ordered[key] = obj[key]
  })

  return ordered
}

/**
 * Generate new object with empty keys removed
 * @param {*} obj any object
 * @returns {*} object with only populated keys
 */
function filterEmpty(obj) {
  const filtered = {}

  Object.keys(obj).forEach((key) => {
    if (obj[key].length) {
      filtered[key] = obj[key]
    }
  })

  return filtered
}

/**
 * Generate new object with invalid Semantic-UI-CSS paths removed
 * @param {*} obj any object
 * @returns {*} object with valid paths
 */
function filterInvalidPaths(deps) {
  const filtered = {}

  Object.keys(deps).forEach((key) => {
    if (deps[key]) {
      filtered[key] = deps[key].filter(dep => fs.existsSync(`node_modules/semantic-ui-css/components/${dep.toLowerCase()}.min.css`))
    }
  })

  return filtered
}

/**
 * Generate new object with single-depth, local refs resolved
 * @param {*} obj any object
 * @returns {*} object without circular refs
 */
function removeCircularRefStrings(obj) {
  const flattened = {}

  Object.entries(obj).forEach(([key, val]) => {
    const newVal = val

    val && val.forEach((ref) => {
      if (obj[ref]) newVal.push(...obj[ref])
    })

    // remove duplicates
    flattened[key] = [...new Set(newVal)]
  })

  return flattened
}

/**
 * write given object to given filepath
 * @param {string} filepath location of file to write to
 * @param {*} obj content to write to file
 */
function writeObjToFile(filepath, obj) {
  fs.writeFileSync(filepath, JSON.stringify(obj, null, 2), 'utf8')
}

module.exports = {
  getPackagePath,
  sortKeys,
  filterEmpty,
  filterInvalidPaths,
  removeCircularRefStrings,
  writeObjToFile
}
