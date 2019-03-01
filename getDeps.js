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

// run as node.js script
// writeDependencies(utils.filterEmpty(utils.filterInvalid(utils.sortKeys(getFiles()))))

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

      // skip files that do not start with an uppercase letter
      if (/[^A-Z]/.test(basename[0])) {
        return
      }
      files[basename] = item.path.substring(srcDirPath.length).replace(/\\/g, '/')
    })
  })

  const f = {}
  Object.keys(files).forEach((file) => {
    const data = fs.readFileSync(`node_modules/semantic-ui-react/dist/es${files[file]}`, 'utf8')
    const reg = /(?<=import )(\w*)(?=.*'\.)/mg
    const match = data.match(reg)
    const matchFilter = match && match.filter(m => m && m)
    if (matchFilter) matchFilter.unshift(file)

    f[file] = matchFilter
  })

  return f
}

function flattenDeps(deps) {
  const flat = {}

  Object.keys(deps).forEach((dep) => {
    const newDepList = deps[dep]

    deps[dep] && deps[dep].forEach((depItem) => {
      if (deps[depItem]) newDepList.push(...deps[depItem])
    })

    flat[dep] = [...new Set(newDepList)]
  })

  return flat
}

function getCleanedDeps() {
  return filterEmpty(filterInvalidPaths(flattenDeps(sortKeys(getDeps()))))
}

function writeDependencies(obj) {
  writeObjToFile('dependencies-test.json', obj)
}

module.exports = {
  getDeps,
  getCleanedDeps,
  writeDependencies
}
