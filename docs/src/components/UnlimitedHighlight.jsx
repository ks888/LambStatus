import React from "react"

import Highlight, {iconTypes} from '../components/Highlight'

class UnlimitedHighlight extends React.Component {
  render() {
    const headline = 'Unlimited';
    const desc = 'No limitations on features and the number of subscribers/team members/metrics!';

    return (
      <Highlight headline={headline} description={desc} iconType={iconTypes.unlimited} />
    )
  }
}

export default UnlimitedHighlight;
