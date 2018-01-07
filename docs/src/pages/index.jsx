import React from "react"
import Helmet from "react-helmet"

import SEO from "../components/SEO/SEO"
import config from "../../data/SiteConfig"
import MainHeader from '../components/Layout/Header'
import Features from '../components/Layout/Features'
import Highlights from '../components/Layout/Highlights'
import Demo from '../components/Demo'
import Footer from '../components/Layout/Footer'

class Index extends React.Component {
  render() {
    const postEdges = this.props.data.allMarkdownRemark.edges;
    return (
      <div className="index-container">
        <Helmet title={config.siteTitleInHeader} />
        <SEO postEdges={postEdges} />
        <main>
          <MainHeader
            siteTitle={config.siteTitle}
            siteDescription={config.siteDescription}
            location={this.props.location}
          />
          <Highlights />
          <Features />
          <Demo />
          <Footer />
        </main>
      </div>
    );
  }
}

export default Index;

/* eslint no-undef: "off"*/
export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(
      limit: 2000
    ) {
      edges { 
        node {
          fields {
            slug
          }
          excerpt
          timeToRead
          frontmatter {
            title
          }
        }
      }
    }
  }
`;
