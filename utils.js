const path = require('path')
const fs = require('fs')

/**
 * Returns the path to the given package.
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

function sortKeys(obj) {
  const ordered = {}
  Object.keys(obj).sort().forEach((key) => {
    ordered[key] = obj[key]
  })

  return ordered
}

function filterEmpty(obj) {
  const filtered = {}

  Object.keys(obj).forEach((key) => {
    if (obj[key].length) {
      filtered[key] = obj[key]
    }
  })

  return filtered
}

function filterInvalidPaths(deps) {
  const filtered = {}

  Object.keys(deps).forEach((key) => {
    if (deps[key]) {
      filtered[key] = deps[key].filter(dep => fs.existsSync(`node_modules/semantic-ui-css/components/${dep.toLowerCase()}.min.css`))
    }
  })

  return filtered
}

function writeObjToFile(filepath, obj) {
  fs.writeFileSync(filepath, JSON.stringify(obj, null, 2), 'utf8')
}

module.exports = {
  getPackagePath,
  sortKeys,
  filterEmpty,
  filterInvalidPaths,
  writeObjToFile
}
