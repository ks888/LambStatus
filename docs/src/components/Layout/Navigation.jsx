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
      logo = <Logo src='/logos/logo-medium-light.png' alt='' />
      style = {color: 'white'};
    } else {
      logo = <Logo src='/logos/logo-medium-normal.png' alt='' />
      style = {color: 'black'};
    }
    return (
      <NavContainer >
        <section>
          {logo}
          <Link className='nav-link' style={style} to='/' > HOME </Link>
          <Link className='nav-link' style={style} to='/get-started' > DOCS </Link>
          <Link className='nav-link' style={style} to='/get-started' > GET STARTED </Link>
          <a className='nav-link' style={style} href={config.userLinks.APIDoc} > API </a>
          <a className='nav-link' style={style} href={config.userLinks.GitHub} > GITHUB </a>
        </section>
        <UserLinks />
      </NavContainer>
    )
  }
}

export default Navigation
