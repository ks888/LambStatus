import React from "react"
import Helmet from "react-helmet"

import config from "../../data/SiteConfig"
import MainHeader from '../components/Layout/Header'
import Checkout from "../components/Checkout"
import Footer from '../components/Layout/Footer'

const getQueryValue = (input, key) => {
  let query = input
  if (input.startsWith('?')) {
    query = input.substring(1)
  }

  const kvs = query.split('&')
  for (let i = 0; i < kvs.length; i += 1) {
    const kv = kvs[i].split('=')
    if (kv[0] === key) {
      return kv[1]
    }
  }
  return ''
}

class Donate extends React.Component {
  constructor(props) {
    super(props)
    this.result = getQueryValue(this.props.location.search, 'result')
  }

  render() {
    return (
      <div className="index-container">
        <Helmet title={config.siteTitleInHeader} />
        <main>
          <MainHeader
            siteTitle={config.siteTitle}
            siteDescription={config.siteDescription}
            location={this.props.location}
          />
          <Checkout result={this.result} />
          <Footer fixed />
        </main>
      </div>
    );
  }
}

export default Donate;
