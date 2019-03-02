const path = require('path')
const fs = require('fs')
const dirTree = require('directory-tree')
const {
  getPackagePath,
  sortKeys,
  filterEmpty,
  filterInvalidPaths,
  writeObjToFile
} = require('./utils')
const { getCleanedDeps } = require('./getDeps')

// TODO: handle null checking earlier
// TODO: better name variables

/**
 * Gathers import paths of Semantic Styled UI React components from
 * semantic-ui-react package folder.
 * @returns {*} An object where the keys are Semantic UI React component
 * names and the values are the corresponding
 * import paths (relative to semantic-ui-react/dist/[import type]/ or
 * semantic-ui-react/src/ (for es='src').
 */
function getSSUIDeps() {
  const SSUIPath = getPackagePath('semantic-styled-ui')
  const srcDirPath = path.resolve(SSUIPath, 'src')

  const baseMapping = getCleanedDeps()
  const SSUIMapping = {}

  // load all SSUI files
  dirTree(srcDirPath, { extensions: /\.js$/ }, (item) => {
    const SSUIDeps = []

    const name = item.name.slice(0, item.name.indexOf('.js'))

    const data = fs.readFileSync(item.path, 'utf8')

    // match semantic-styled-ui imports
    const SSUIMatches = (data.match(/(?<=(?:{|,| ) )([A-Z][a-z]+)+(?=(?:(?:.|\n)(?!import))*?semantic-ui-react)/gm))

    // push all deps from base mapping for each SSUI import
    SSUIMatches && SSUIMatches.forEach((match) => {
      const deps = baseMapping[match]
      deps && deps.forEach((dep) => {
        SSUIDeps.push(dep)
      })
    })

    // remove dupes
    SSUIMapping[name] = [...new Set(SSUIDeps)]
  })

  return SSUIMapping
}

function getCleanedSSUIDeps() {
  return filterEmpty(filterInvalidPaths(sortKeys(getSSUIDeps())))
}

function writeSSUIDependencies(obj) {
  writeObjToFile('dependencies-SSUI.json', obj)
}

module.exports = {
  getSSUIDeps,
  getCleanedSSUIDeps,
  writeSSUIDependencies
}
