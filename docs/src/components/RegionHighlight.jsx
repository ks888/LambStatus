import React from "react"

import Highlight, {iconTypes} from '../components/Highlight'

class RegionHighlight extends React.Component {
  render() {
    const headline = 'Reduce the Impact of Outage';
    const desc = 'Choose the region different from your service\'s region so that the region outage doesn\'t affect your status page!';

    return (
      <Highlight headline={headline} description={desc} iconType={iconTypes.globe} />
    )
  }
}

export default RegionHighlight;
