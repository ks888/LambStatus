import React from "react"
import styled from "styled-components"

import Feature from '../../components/Feature'

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
    const incidentFeature = (
      <Feature title='Incidents and Maintenance' description='If a issue happens, create a new incident to tell the situations immediately to your users. When a maintenance is planned, publish a schedule so that your users know the unavailability in advance.' />
    )
    const desc = 'Show the metrics like the response time to numerically represent your service\'s status. It can be easily integrated with your monitoring services via built-in integration.'
    const metricsFeature = (
      <Feature title='Metrics' description={desc} />
    )
    const notificationsFeature = (
      <Feature title='Notifications' description='Notifications enable your users to keep in touch with your service. LambStatus supports the notification by the email (coming soon) and the rss.' />
    )
    const apiFeature = (
      <Feature title='API' description='Integrate with your existing systems by our simple REST API! It enables you to create and update an incident, submit the metrics data, and so on.' />
    )
    const designFeature = (
      <Feature title='Responsive & Customizable' description='The status page is displayed well on both desktop and mobile devices. Further, you can customize it to show off your brand!' />
    )

    return (
      <Container>
        <InnerContainer>
          <Title>
            Features
          </Title>
          <Items>
            {incidentFeature}
            {metricsFeature}
            {notificationsFeature}
            {apiFeature}
            {designFeature}
          </Items>
        </InnerContainer>
      </Container>
    )
  }
}

export default Features;
