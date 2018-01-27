import React from "react"
import styled from 'styled-components'

import Navigation from './Navigation'
import GetStarted from '../../components/GetStarted'

const Logo = styled.img`
  width: 500px;
  @media screen and (max-width: 600px) {
    width: 400px;
  }

  @media screen and (max-width: 500px) {
    width: 350px;
  }

  @media screen and (max-width: 400px) {
    width: 300px;
  }
`

const Title = styled.h2`
  @media screen and (max-width: 600px) {
    font-size: 3.0rem;
  }

  @media screen and (max-width: 500px) {
    font-size: 2.6rem;
  }

  @media screen and (max-width: 400px) {
    font-size: 2.3rem;
  }
`

const Description = styled.h4`
  @media screen and (max-width: 600px) {
    font-size: 2.2rem;
  }

  @media screen and (max-width: 500px) {
    font-size: 2.0rem;
  }

  @media screen and (max-width: 400px) {
    font-size: 1.8rem;
  }
`

class MainHeader extends React.Component {
  getHeader() {
    if (this.props.location) {
      if (this.props.location.pathname === '/') {
        return (
          <IndexHeadContainer>
            <Navigation />
            <Hero>
              <Logo src='/logos/logo-large-normal.png' alt='' />
              <Title>{this.props.siteTitle}</Title>
              <Description>{this.props.siteDescription}</Description>
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


