import React from "react"
import styled, { css } from 'styled-components'

import Navigation from './Navigation'

const Container = styled.div`
  background: ${props => props.theme.brandDark};
  ${props =>
    props.fixed &&
    css`
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
    `};
`

class Footer extends React.Component {
  render() {
    return(
      <section>
        <Container fixed={this.props.fixed}>
          <Navigation light />
        </Container>
      </section>
    )
  }
}

export default Footer
