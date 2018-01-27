import React from "react"
import styled from "styled-components"

const Item = styled.div`
  color: ${props => props.theme.inkLight};
  font-size: 2.0rem;
  width: 50%;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-right: 30px;

  @media screen and (max-width: 768px) {
    width: 100%;
  }
`

const Title = styled.div`
  color: ${props => props.theme.brandDark};
  font-weight: 500;
  font-size: 2.4rem;
  padding-bottom: 15px;
`

const Description = styled.div`
  font-size: 1.8rem;
`

class Feature extends React.Component {
  render() {
    return (
      <Item>
        <Title>{this.props.title}</Title>
        <Description>{this.props.description}</Description>
      </Item>
    )
  }
}

export default Feature;
