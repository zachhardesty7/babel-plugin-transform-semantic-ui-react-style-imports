// TODO: test using a regex to match after "cx()" call
const path = require('path')
const fs = require('fs')
const dirTree = require('directory-tree')
const {
  getPackagePath,
  sortKeys,
  filterInvalidPaths,
  filterInvalidKeyPaths,
  flattenCircularRefs,
  writeObjToFile
} = require('./utils')

/**
 * Gathers import paths of Semantic UI React components from semantic-ui-react package folder.
 * @returns {*} An object where the keys are Semantic UI React component
 * names and the values are the corresponding
 * import paths (relative to semantic-ui-react/dist/[import type]/ or
 * semantic-ui-react/src/ (for es='src').
 */
function getDeps() {
  const files = {}
  const semanticUiReactPath = getPackagePath('semantic-ui-react')
  const srcDirPath = path.resolve(semanticUiReactPath, 'src')

  const searchFolders = [
    'addons',
    'behaviors',
    'collections',
    'elements',
    'modules',
    'views'
  ]

  searchFolders.forEach((searchFolder) => {
    const searchRoot = path.resolve(srcDirPath, searchFolder)

    dirTree(searchRoot, { extensions: /\.js$/ }, (item) => {
      const basename = path.basename(item.path, '.js')

      // only parse files that start with an uppercase letter
      if (/^[A-Z]/.test(basename[0])) {
        files[basename] = item.path.substring(srcDirPath.length).replace(/\\/g, '/')
      }
    })
  })

  const f = {}
  // load files & accumulate linked deps
  Object.entries(files).forEach(([name, dep]) => {
    const data = fs.readFileSync(path.resolve(semanticUiReactPath, 'dist/es/', dep.slice(1)), 'utf8')
    const reg = /(?<=import )(\w*)(?=.*'\.)/mg
    const match = data.match(reg)
    const matchFilter = match && match.filter(x => x)
    if (matchFilter) {
      matchFilter.unshift(name) // add original file name
      f[name] = matchFilter
    }
  })

  return f
}

function getCleanedDeps() {
  return (
    sortKeys(
      flattenCircularRefs(
        filterInvalidPaths(
          filterInvalidKeyPaths(
            getDeps()
          )
        )
      )
    )
  )
}

function writeDependencies(obj) {
  writeObjToFile('dependencies.json', obj)
}

module.exports = {
  getDeps,
  getCleanedDeps,
  writeDependencies
}
