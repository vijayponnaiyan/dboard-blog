import React from 'react'
import Blog from './Blogs'

describe('<Blog />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Blog />)
  })
})