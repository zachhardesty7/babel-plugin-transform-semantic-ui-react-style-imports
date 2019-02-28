// TODO: test using a regex to match after "cx()" call
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

// run as node.js script
// writeDependencies(utils.filterEmpty(utils.filterInvalid(utils.sortKeys(getFiles()))))

/**
 * Gathers import paths of Semantic UI React components from semantic-ui-react package folder.
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

  dirTree(srcDirPath, { extensions: /\.js$/ }, (item) => {
    const SSUIDeps = []

    const name = item.name.slice(0, item.name.indexOf('.js'))

    const data = fs.readFileSync(
      `${srcDirPath}${item.path.substring(srcDirPath.length).replace(/\\/g, '/')}`,
      'utf8'
    )

    // semantic-styled-ui imports
    const SSUIMatches = (data.match(/(?<=(?:{|,| ) )([A-Z][a-z]+)+(?=(?:(?:.|\n)(?!import))*?semantic-ui-react)/gm))

    SSUIMatches && SSUIMatches.forEach((match) => {
      const deps = baseMapping[match]
      deps && deps.forEach((dep) => {
        SSUIDeps.push(dep)
      })
    })

    const cleanedSSUIDeps = [...new Set(SSUIDeps)]
    SSUIMapping[name] = cleanedSSUIDeps
  })

  return SSUIMapping
}

function getCleanedSSUIDeps() {
  return filterEmpty(filterInvalidPaths(sortKeys(getSSUIDeps())))
}

function writeSSUIDependencies(obj) {
  writeObjToFile('dependencies-SSUI-test.json', obj)
}

module.exports = {
  getSSUIDeps,
  getCleanedSSUIDeps,
  writeSSUIDependencies
}
