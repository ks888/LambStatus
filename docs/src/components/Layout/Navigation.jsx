import React from "react"
import Link from 'gatsby-link'
import styled from 'styled-components'

import UserLinks from '../UserLinks'
import config from "../../../data/SiteConfig"

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: ${props => props.theme.sitePadding};

  .nav-link {
    font-size: 1.6rem;
    margin-right: 15px;
    font-weight: 200;
    vertical-align: 35%;

    @media screen and (max-width: 768px) {
      display: none;
    }
  }
`

const LogoLink = styled.a`
  text-decoration: none;
  border: 0 none;

  :hover {
    text-decoration: none;
    border: 0 none;
  }
`

const Logo = styled.img`
  margin-right: 25px;
  width: 180px;
`

class Navigation extends React.Component {
  render() {
    let logo;
    let style;
    if (this.props.light) {
      logo = <LogoLink href='/'><Logo src='/logos/logo-medium-light.png' alt='' /></LogoLink>
      style = {color: 'white'};
    } else {
      logo = <LogoLink href='/'><Logo src='/logos/logo-medium-normal.png' alt='' /></LogoLink>
      style = {color: 'black'};
    }
    return (
      <NavContainer >
        <section>
          {logo}
          <Link className='nav-link' style={style} to='/' > HOME </Link>
          <Link className='nav-link' style={style} to='/get-started' > DOCS </Link>
          <Link className='nav-link' style={style} to='/get-started' > GET STARTED </Link>
          <a className='nav-link' style={style} target='_blank' href={config.userLinks.APIDoc} > API </a>
          <Link className='nav-link' style={style} to='/donate' > DONATE </Link>
        </section>
        <UserLinks />
      </NavContainer>
    )
  }
}

export default Navigation
