import React from "react"
import styled from "styled-components"

import ServerlessHighlight from '../../components/ServerlessHighlight'
import PayasyougoHighlight from '../../components/PayasyougoHighlight'
import ClickHighlight from '../../components/ClickHighlight'
import RegionHighlight from '../../components/RegionHighlight'

const HighlightContainer = styled.div`
  padding: ${props => props.theme.sitePadding};
  max-width: ${props => props.theme.contentWidthLaptop};
  margin: 0 auto;

  display: flex;
  flex-wrap: wrap;

  @media screen and (max-width: 768px) {
    padding-left: 0px;
    padding-right: 0px;
  }
`

class Highlights extends React.Component {
  render() {
    return (
      <HighlightContainer>
        <ServerlessHighlight />
        <PayasyougoHighlight />
        <ClickHighlight />
        <RegionHighlight />
      </HighlightContainer>
    )
  }
}

export default Highlights;
