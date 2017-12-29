import React from "react"

import Highlight, {iconTypes} from '../components/Highlight'

class PayasyougoHighlight extends React.Component {
  render() {
    const headline = 'Pay-as-you-go';
    const desc = 'Pay only for what you use. The system takes only $1 per 30,000 visitors and almost $0 if no visitors.';

    return (
      <Highlight headline={headline} description={desc} iconType={iconTypes.creditCard} />
    )
  }
}

export default PayasyougoHighlight;
