import React from "react"

import Highlight, {iconTypes} from '../components/Highlight'

class RegionHighlight extends React.Component {
  render() {
    const headline = 'Choose your region';
    const desc = 'Choose the AWS region different from your service\'s region. If both your service and its status page rely on the same region, the region outage may stop both.';

    return (
      <Highlight headline={headline} description={desc} iconType={iconTypes.globe} />
    )
  }
}

export default RegionHighlight;
