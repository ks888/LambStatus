import React from "react"
import styled from 'styled-components'

import Navigation from './Navigation'
import GetStarted from '../../components/GetStarted'

class MainHeader extends React.Component {
  getHeader() {
    if (this.props.location) {
      if (this.props.location.pathname === '/') {
        return (
          <IndexHeadContainer>
            <Navigation />
            <Hero>
              <img src={this.props.logo} alt='' width='500px' />
              <h1>{this.props.siteTitle}</h1>
              <h4>{this.props.siteDescription}</h4>
              <GetStarted />
            </Hero>
          </IndexHeadContainer>
        )
      }
      return (
        <SiteContainer>
          <Navigation />
        </SiteContainer>
      )
    }
    return <div />
  }

  render() {
    return this.getHeader()
  }
}

const IndexHeadContainer = styled.div`
  background: ${props => props.theme.brandLight};
  text-align: center;
`

const SiteContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${props => props.theme.brandLight};
  height: 100%;
`

const Hero = styled.div`
  padding: 50px 0;
  & > h1 {
    font-weight: 600;  
  }
`

export default MainHeader


