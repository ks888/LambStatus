import React from "react"
import styled from "styled-components"

import FeatureItem from '../../components/FeatureItem'

const Container = styled.div`
  background: ${props => props.theme.brandLight};
`

const InnerContainer = styled.div`
  padding: ${props => props.theme.sitePadding};
  max-width: ${props => props.theme.contentWidthLaptop};
  margin: 0 auto;
`

const Title = styled.h2`
  color: ${props => props.theme.brand};
`

const Items = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 30px;
`

class Features extends React.Component {
  render() {
    return (
      <Container>
        <InnerContainer>
          <Title>
            Features
          </Title>
          <Items>
            <FeatureItem text='Status management by service components' />
            <FeatureItem text='Incidents' />
            <FeatureItem text='Scheduled maintenance' />
            <FeatureItem text='Metrics' />
            <FeatureItem text='Notification via email (coming soon!) and RSS' />
            <FeatureItem text='Custom domain' />
            <FeatureItem text='API' />
            <FeatureItem text='Integration with other monitoring systems' />
          </Items>
        </InnerContainer>
      </Container>
    )
  }
}

export default Features;
