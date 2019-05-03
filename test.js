const babel = require('@babel/core')
const plugin = require('.')

const input = `
  import {
    Segment,
    Container,
    Header,
    Grid
  } from 'semantic-ui-react'
  import { PortfolioItem } from 'semantic-styled-ui'

  import { media, utils } from '../utils'

  const Portfolio = ({ data }) => {
    const { title, pieces } = data.allContentfulPortfolio.edges[0].node
  }
`
const { code } = babel.transformSync(input, { plugins: [plugin] })

console.log(code)
