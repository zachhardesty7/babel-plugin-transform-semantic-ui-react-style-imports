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

## Running the tests (soon)

    git clone https://github.com/zachhardesty7/babel-plugin-transform-semantic-ui-react-style-imports.git
    cd babel-plugin-transform-semantic-ui-react-style-imports
    npm install
    npm run test

## Acknowledgements

heavy inspiration taken from [skleeschulte](https://github.com/skleeschulte/babel-plugin-transform-semantic-ui-react-imports)