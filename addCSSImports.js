const path = require('path')
const fs = require('fs')
const dirTree = require('directory-tree')
const { getCleanedDeps } = require('./getDeps')

// TODO: split into separate functions
// TODO: document regex
// TODO: handle null checking earlier
// TODO: better name variables
function addCSSImports() {
  const mapping = getCleanedDeps()

  const srcDirPath = path.resolve('src')

  dirTree(srcDirPath, { extensions: /\.js$/ }, (item) => {
    const data = fs.readFileSync(
      `src${item.path.substring(srcDirPath.length).replace(/\\/g, '/')}`,
      'utf8'
    )

    // regular imports
    const packageRegex = /(?<=(?:{|,| ) )([A-Z][a-z]+)+(?=(?:(?:.|\n)(?!import))*?semantic-ui-react)/gm
    const matches = (data.match(packageRegex))

    const newImports = []
    matches && matches.forEach((match) => {
      const deps = mapping[match]
      deps.forEach((dep) => {
        newImports.push(`import 'semantic-ui-css/components/${dep.toLowerCase()}.min.css'`)
      })
    })

    // semantic-styled-ui imports
    const SSUIMatches = (data.match(/(?<=(?:{|,| ) )([A-Z][a-z]+)+(?=(?:(?:.|\n)(?!import))*?semantic-styled-ui)/gm))

    const SSUIDirPath = path.resolve('node_modules/semantic-styled-ui/dist')

    dirTree(SSUIDirPath, { extensions: /\.js$/ }, (item2) => {
      const name = item2.name.slice(0, item2.name.indexOf('.js'))

      if (SSUIMatches && SSUIMatches.includes(name)) {
        const p2 = `node_modules/semantic-styled-ui/dist${item2.path.substring(SSUIDirPath.length).replace(/\\/g, '/')}`
        const data2 = fs.readFileSync(p2, 'utf8')

        const matches3 = (data2.match(packageRegex))

        matches3 && matches3.forEach((match) => {
          const deps = mapping[match]
          deps && deps.forEach((dep) => {
            newImports.push(`import 'semantic-ui-css/components/${dep.toLowerCase()}.min.css'`)
          })
        })
      }
    })
    //

    // remove duplicate imports
    const cleanedNewImports = [...new Set(newImports)]

    // only write data to file if there's CSS to import
    if (cleanedNewImports.length) {
      const importsRegex = /(.|\n)*import (.|\n)*?\n\n/gm
      const newFile = data.replace(
        importsRegex,
        `$&${cleanedNewImports && cleanedNewImports.join('\n')}\n\n`
      )
      fs.writeFileSync(item.path, newFile, 'utf8')
    }
  })
}

module.exports = {
  addCSSImports
}
