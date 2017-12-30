import React from "react"

import Highlight, {iconTypes} from '../components/Highlight'

class ClickHighlight extends React.Component {
  render() {
    const headline = 'Just a Few Clicks';
    const desc = 'Everything to launch the system is written as the code. You can build your status page with a few clicks!';

    return (
      <Highlight headline={headline} description={desc} iconType={iconTypes.mousePointer} />
    )
  }
}

export default ClickHighlight;
