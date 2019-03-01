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
        const addImports = []

        if (match1) {
          const memberImports = path.node.specifiers.filter(specifier => specifier.type === 'ImportSpecifier')

          // For each member import of a known component, add a separate import statement
          memberImports.forEach((memberImport) => {
            const deps = mapping[memberImport.imported.name]
            deps && deps.forEach((dep) => {
              addImports.push(t.importDeclaration([], t.stringLiteral(`semantic-ui-css/components/${dep.toLowerCase()}.min.css`)))
            })
          })
        }

        const packageRegex2 = /^((.*!)?semantic-styled-ui)([/\\].*)?$/
        const match2 = packageRegex2.exec(path.node.source.value)

        if (match2) {
          const memberImports = path.node.specifiers.filter(specifier => specifier.type === 'ImportSpecifier')

          // For each member import of a known component, add a separate import statement
          memberImports.forEach((memberImport) => {
            const deps = mappingSSUI[memberImport.imported.name]
            deps && deps.forEach((dep) => {
              addImports.push(t.importDeclaration([], t.stringLiteral(`semantic-ui-css/components/${dep.toLowerCase()}.min.css`)))
            })
          })
        }

        const packageRegex3 = /^semantic-ui-css\/semantic.min.css$/
        const match3 = packageRegex3.exec(path.node.source.value)
        if (match3) {
          // For each member import of a known component, add a separate import statement
          addImports.push(t.importDeclaration([], t.stringLiteral(`semantic-ui-css/components/reset.min.css`)))
          addImports.push(t.importDeclaration([], t.stringLiteral(`semantic-ui-css/components/site.min.css`)))
        }

        // FIXME: will input duplicate imports (webpack should eliminate)
        if (match1 || match2 || match3) {
          path.insertAfter(addImports)
        }

        if (match3) {
          path.remove()
        }
      }
    }
  }
}

module.exports = transform
