import React from "react"

import Highlight, {iconTypes} from '../components/Highlight'

class RegionHighlight extends React.Component {
  render() {
    const headline = 'Choose a Different Region';
    const desc = 'You can choose the region different from your service\'s region, to reduce the influence of the region outage!';

    return (
      <Highlight headline={headline} description={desc} iconType={iconTypes.globe} />
    )
  }
}

export default RegionHighlight;
