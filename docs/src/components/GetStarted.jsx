import React from "react"
import styled from "styled-components"

const Button = styled.a`
  display: inline-block;
  border-radius: 5px;
  padding-right: 30px;
  padding-left: 30px;
  font-size: 2.2rem;
  background-color: ${props => props.theme.accent};
  color: ${props => props.theme.ink};
  cursor: pointer;
  text-decoration: none;
  border-style: none;
  line-height: 3.6rem;
  font-weight: 300;
  border: 1px solid;
`

class GetStarted extends React.Component {
  render() {
    return (
      <Button href='/get-started'>Get Started</Button>
    );
  }
}

export default GetStarted;
