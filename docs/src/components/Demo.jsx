import React from "react"
import styled from "styled-components"

import {FaCaretRight, FaExternalLink} from 'react-icons/lib/fa'

const Container = styled.div`
  padding: ${props => props.theme.sitePadding};
  max-width: ${props => props.theme.contentWidthLaptop};
  margin: 0 auto;
`

const Title = styled.h2`
  color: ${props => props.theme.brand};
`

const InnerContainer = styled.div`
  padding-bottom: ${props => props.theme.sitePadding};
`

const Text = styled.div`
  padding-bottom: 10px;
  font-size: 2.0rem;
  color: ${props => props.theme.inkLight};
`

const Link = styled.a`
  font-size: 2.0rem;
  color: ${props => props.theme.inkLight};
`

const statusPageDemoLink = 'https://demo-status.lambstatus.org/'
const adminPageDemoLink = 'https://demo-admin.lambstatus.org/'

class Demo extends React.Component {
  render() {
    return (
      <Container>
        <Title>Demo</Title>
        <InnerContainer>
          <Text>
            <FaCaretRight />
            <Link href={statusPageDemoLink} target='_blank' >
              Status page: the page to tell your service's status to your users <FaExternalLink />
            </Link>
          </Text>
          <Text>
            <FaCaretRight />
            <Link href={adminPageDemoLink} target='_blank' >
              Admin page: the page to manage your service's status <FaExternalLink />
            </Link>
          </Text>
        </InnerContainer>
      </Container>
    );
  }
}

export default Demo;
