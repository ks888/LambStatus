import React from "react"

import Highlight, {iconTypes} from '../components/Highlight'

class ServerlessHighlight extends React.Component {
  render() {
    const headline = 'Serverless';
    const desc = 'Eases your pain caused by the scaling / availability issues. It is terrible if your service is down AND heavy traffic from stuck users stops your status page.';

    return (
      <Highlight headline={headline} description={desc} iconType={iconTypes.server} />
    )
  }
}

export default ServerlessHighlight;
