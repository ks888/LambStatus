import React from 'react'
import styled from "styled-components"

const Container = styled.div`
  padding: ${props => props.theme.sitePadding};
`

const Title = styled.div`
  color: ${props => props.theme.brandDark};
  font-weight: 500;
  font-size: 2.8rem;
  padding-bottom: 15px;
`

const Description = styled.div`
  color: ${props => props.theme.inkLight};
  font-size: 1.8rem;
  padding-bottom: 15px;
`

const Amounts = styled.div`
  margin-bottom: 7px;
`

const Amount = styled.button`
  display: inline-block;
  padding-right: 10px;
  padding-left: 10px;
  font-size: 1.8rem;
  background-color: ${props => (props.highlight ? props.theme.accent : 'white')};
  color: ${props => props.theme.ink};
  cursor: pointer;
  text-decoration: none;
  border-style: none;
  line-height: 3.6rem;
  font-weight: 300;
  border: 1px solid;
  margin-left: 3px;
`

const Button = styled.a`
  display: inline-block;
  border-radius: 5px;
  padding-right: 57px;
  padding-left: 57px;
  font-size: 1.8rem;
  background-color: ${props => props.theme.accent};
  color: ${props => props.theme.ink};
  cursor: pointer;
  text-decoration: none;
  border-style: none;
  line-height: 3.6rem;
  font-weight: 300;
  border: 1px solid;
  margin-left: 3px;
  margin-bottom: 3px;
`

const SuccessMessage = styled.text`
  color: ${props => props.theme.brandDark};
  font-size: 1.5rem;
  font-weight: 500;
  padding-left: 8px;
`

const CancelMessage = styled.text`
  color: crimson;
  font-size: 1.5rem;
  font-weight: 500;
  padding-left: 8px;
`

const Note = styled.text`
  font-size: 1.2rem;
  padding-left: 20px;
`

// settings for test
// const key = 'pk_test_c0CvrGE6DwozMVAqAbanyQpX'
// const SKUs = {
//   10: 'sku_ENLYAWyPkuBiNW',
//   50: 'sku_ENOwWqvX7LryCj',
//   100: 'sku_ENOw44RV626FkK'
// }

// settings for prod
const key = 'pk_live_gyoF8TAowyI5UbnnkfrQ9wlD'
const SKUs = {
  10: 'sku_ENLPrrVCCMeLkE',
  50: 'sku_ENOx44ysAnEARy',
  100: 'sku_ENOxrsJ6OCh0wj'
}

const Checkout = class extends React.Component {
  constructor(props) {
    super(props)
    this.state = { amount: 10 }
    this.result = props.result
  }

  componentDidMount() {
    this.stripe = window.Stripe(key)
  }

  redirectToCheckout(event) {
    event.preventDefault()
    this.stripe.redirectToCheckout({
      items: [{ sku: SKUs[this.state.amount], quantity: 1 }],
      successUrl: `https://lambstatus.github.io/donate?result=success`,
      cancelUrl: `https://lambstatus.github.io/donate?result=cancel`,
    }).then(({error}) => {
      if (error) {
        console.warn('Error:', error)
      }
    })
  }

  changeAmount(value) {
    this.setState({ amount: value })
  }

  render() {
    let message
    if (this.result === 'success') {
      message = <SuccessMessage>Thank you for your donation!</SuccessMessage>
    } else if (this.result === 'cancel') {
      message = <CancelMessage>Canceled.</CancelMessage>
    }

    return (
      <Container>
        <Title>Donation</Title>
        <Description>Please support the development and maintenance of LambStatus!</Description>
        <Amounts>
          <Amount highlight={this.state.amount === 10} onClick={() => this.changeAmount(10)}>$10</Amount>
          <Amount highlight={this.state.amount === 50} onClick={() => this.changeAmount(50)}>$50</Amount>
          <Amount highlight={this.state.amount === 100} onClick={() => this.changeAmount(100)}>$100</Amount>
        </Amounts>
        <div>
          <Button onClick={event => this.redirectToCheckout(event)}>Donate</Button>
          {message}
        </div>
        <Note>(jumps to the Stripe page)</Note>
      </Container>
    )
  }
}

export default Checkout
