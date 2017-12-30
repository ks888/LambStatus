import React from "react"
import styled from 'styled-components'

import Navigation from './Navigation'

const Container = styled.div`
  background: ${props => props.theme.brandDark};
`

class Footer extends React.Component {
  render() {
    return(
      <section>
        <Container>
          <Navigation light />
        </Container>
      </section>
    )
  }
}

export default Footer
