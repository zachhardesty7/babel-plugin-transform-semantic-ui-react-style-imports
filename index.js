const { getCleanedDeps } = require('./getDeps')
const { getCleanedSSUIDeps } = require('./getSSUIDeps')

const mapping = getCleanedDeps()
const mappingSSUI = getCleanedSSUIDeps()

function transform({ types: t }) {
  return {
    visitor: {
      ImportDeclaration(path, state) {
        const packageRegex = /^((.*!)?semantic-ui-react)([/\\].*)?$/
        const match1 = packageRegex.exec(path.node.source.value)

        if (match1) {
          const memberImports = path.node.specifiers.filter(specifier => specifier.type === 'ImportSpecifier')

          const addImports = []

          // For each member import of a known component, add a separate import statement
          memberImports.forEach((memberImport) => {
            const deps = mapping[memberImport.imported.name]
            deps && deps.forEach((dep) => {
              addImports.push(t.importDeclaration([], t.stringLiteral(`semantic-ui-css/components/${dep.toLowerCase()}.min.css`)))
            })
          })

          path.insertAfter(addImports)
        }

        const packageRegex2 = /^((.*!)?semantic-styled-ui)([/\\].*)?$/
        const match2 = packageRegex2.exec(path.node.source.value)

        if (match2) {
          const memberImports = path.node.specifiers.filter(specifier => specifier.type === 'ImportSpecifier')

          const addImports = []

          // For each member import of a known component, add a separate import statement
          memberImports.forEach((memberImport) => {
            const deps = mappingSSUI[memberImport.imported.name]
            deps && deps.forEach((dep) => {
              addImports.push(t.importDeclaration([], t.stringLiteral(`semantic-ui-css/components/${dep.toLowerCase()}.min.css`)))
            })
          })

          path.insertAfter(addImports)
        }
      }
    }
  }
}

module.exports = transform
