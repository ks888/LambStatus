import React from "react"

import Highlight, {iconTypes} from '../components/Highlight'

class ClickHighlight extends React.Component {
  render() {
    const headline = 'Just a few clicks';
    const desc = 'Build and update the system with a few clicks (thanks to the AWS CloudFormation!)';

    return (
      <Highlight headline={headline} description={desc} iconType={iconTypes.mousePointer} />
    )
  }
}

export default ClickHighlight;
