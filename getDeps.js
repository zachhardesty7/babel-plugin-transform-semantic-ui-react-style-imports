const path = require('path')
const fs = require('fs')
const dirTree = require('directory-tree')

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

    f[file] = matchFilter
  })

  const ordered = {}
  Object.keys(f).sort().forEach((key) => {
    ordered[key] = f[key]
  })

  fs.writeFileSync('dependencies-test.json', JSON.stringify(ordered, null, 2), 'utf8')

  return f
}

getDeps()
