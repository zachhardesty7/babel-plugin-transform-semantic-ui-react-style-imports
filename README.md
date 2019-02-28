# babel-plugin-transform-semantic-ui-react-style-imports

The plugin can add import statements for CSS files from
`semantic-ui-css`.

The adding CSS/LESS imports, can be enabled/disabled.
The import type for default imports can
also be configured (e.g. `es` or `commonjs`).

## Installation

    npm install babel-plugin-transform-semantic-ui-react-style-imports --save-dev

Depending on how you use the plugin, you also need to install
[semantic-ui-react](https://www.npmjs.com/package/semantic-ui-react),
[semantic-ui-css](https://www.npmjs.com/package/semantic-ui-css) and/or
[semantic-ui-less](https://www.npmjs.com/package/semantic-ui-less) (see
below).

## Usage

Add the plugin to your Babel configuration (e.g. in .babelrc):

    {
        "plugins": ["transform-semantic-ui-react-style-imports"]
    }

### Plugin options

The plugin supports the following options (these are the default
values):

    {
        "plugins": [
            [
                "transform-semantic-ui-react-imports", {
                    "importType": "es"
                }
            ]
        ]
    }

#### importType (default: `'es'`)

This must be either the name of a folder below `semantic-ui-react/dist`
or `src`. `'es'`, `'commonjs'` or `'umd'`:

- `importType='es'` example output:  
  `import Button from 'semantic-ui-react/dist/es/elements/Button/Button.js';`
- `importType='src'` example output:  
  `import Button from 'semantic-ui-react/src/elements/Button/Button.js';`

## Running the tests (soon)

    git clone https://github.com/zachhardesty7/babel-plugin-transform-semantic-ui-react-style-imports.git
    cd babel-plugin-transform-semantic-ui-react-style-imports
    npm install
    npm run test
