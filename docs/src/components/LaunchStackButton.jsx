import React from "react"
import styled from "styled-components"

import config from "../../data/SiteConfig"

const linkToCreateStack = `https://console.aws.amazon.com/cloudformation/home#/stacks/new?stackName=StatusPage&templateURL=${config.templateLink}`
const launchButtonImage = 'https://dmhnzl5mp9mj6.cloudfront.net/application-management_awsblog/images/cloudformation-launch-stack.png'

const Link = styled.a`
  border-style:none;
  text-decoration: none;
`

const Image = styled.img`
  vertical-align: text-top;
  height: 2.5rem;
`

class LaunchStackButton extends React.Component {
  render() {
    return (
      <Link href={linkToCreateStack} rel="nofollow">
        <Image src={launchButtonImage} alt="Launch CloudFormation Stack" />
      </Link>
    )
  }
}

export default LaunchStackButton;
