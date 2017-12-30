import React from "react"
import styled from "styled-components"
import {FaCaretRight} from 'react-icons/lib/fa'

const Item = styled.div`
  color: ${props => props.theme.inkLight};
  font-size: 2.0rem;
  width: 50%;
  padding-bottom: 10px;
`

class FeatureItem extends React.Component {
  render() {
    return (
      <Item>
        <FaCaretRight />
        {this.props.text}
      </Item>
    )
  }
}

export default FeatureItem;