const path = require('path')
const fs = require('fs')
const dirTree = require('directory-tree')
const {
  sortKeys,
  getPackagePath,
  flattenCircularRefs,
  writeObjToFile,
  ObjectFromEntries
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
  const localSUIMapping = {}
  const localSSUIMapping = {}
  const completeMapping = {}

  // load all SSUI files to get local mappings
  dirTree(srcDirPath, { extensions: /\.js$/ }, (file) => {
    const SUIDeps = []
    const SSUIDeps = []

    const name = file.name.slice(0, file.name.indexOf('.js'))

    // only parse files that start with an uppercase letter
    if (/^[A-Z]/.test(name)) {
      const data = fs.readFileSync(file.path, 'utf8')
      SSUIDeps.push(name)

      // match semantic-ui-react imports
      const SUIMatches = data.match(/(?<=(?:{|,| |\t))[A-Z][A-Za-z]+(?=(?:(?:.|\n)(?!import))*?semantic-ui-react)/gm)

      // match semantic-styled-ui imports
      const SSUIMatches = data.match(/(?<=import )([A-Z][A-Za-z]+)(?=(?: from )(?:'|"|`)(?:\.|\..)(?:\/\w*)+(?:\1)(?:'|"|`))/gm)

      // push all matched SUI imports
      SUIMatches && SUIMatches.forEach((match) => {
        SUIDeps.push(match)
      })

      // push all matched SSUI imports
      SSUIMatches && SSUIMatches.forEach((match) => {
        SSUIDeps.push(match)
      })

      // remove dupes
      localSUIMapping[name] = [...new Set(SUIDeps)]
      localSSUIMapping[name] = [...new Set(SSUIDeps)]
    }
  })

  // translate matches to SUI deps
  Object.entries(flattenCircularRefs(localSSUIMapping)).forEach(([key, deps]) => {
    deps.forEach((dep) => {
      localSUIMapping[dep].forEach((SUIDep) => {
        if (completeMapping[key]) { // already defined
          if (baseMapping[SUIDep]) { // valid SUI element, merge
            completeMapping[key] = [...new Set([...completeMapping[key], ...baseMapping[SUIDep]])]
          }
        } else {
          completeMapping[key] = baseMapping[SUIDep]
        }
      })
    })
  })

  // remove entries without reference
  return ObjectFromEntries(Object.entries(completeMapping).filter(([key, val]) => val))
}

function getCleanedSSUIDeps() {
  return (
    sortKeys(
      getSSUIDeps()
    )
  )
}

function writeSSUIDependencies(obj) {
  writeObjToFile('dependencies-SSUI.json', obj)
}

module.exports = {
  getSSUIDeps,
  getCleanedSSUIDeps,
  writeSSUIDependencies
}
