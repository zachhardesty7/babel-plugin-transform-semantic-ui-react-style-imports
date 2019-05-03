# babel-plugin-transform-semantic-ui-react-style-imports

The plugin can add import statements for CSS files from
`semantic-ui-css`.

## Installation

```bash
    npm install babel-plugin-transform-semantic-ui-react-style-imports --save-dev
```

Depending on how you use the plugin, you also need to install
[semantic-ui-react](https://www.npmjs.com/package/semantic-ui-react) and/or
[semantic-ui-css](https://www.npmjs.com/package/semantic-ui-css).

## Usage

Add the plugin to your Babel configuration (e.g. in .babelrc):

```json
    {
        "plugins": ["transform-semantic-ui-react-style-imports"]
    }
```

## Running the tests (soon)

```bash
    git clone https://github.com/zachhardesty7/babel-plugin-transform-semantic-ui-react-style-imports.git
    cd babel-plugin-transform-semantic-ui-react-style-imports
    npm install
    npm run test
```

## Acknowledgements

heavy inspiration taken from [skleeschulte](https://github.com/skleeschulte/babel-plugin-transform-semantic-ui-react-imports)