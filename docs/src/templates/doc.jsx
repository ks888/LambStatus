import React from "react";
import Helmet from "react-helmet";
import styled from "styled-components"

import SEO from "../components/SEO/SEO"
import SiteHeader from '../components/Layout/Header'
import config from "../../data/SiteConfig"
import TableOfContents from "../components/Layout/TableOfContents";

export default class DocTemplate extends React.Component {
  render() {
    const { slug } = this.props.pathContext;
    const postNode = this.props.data.postBySlug;
    const post = postNode.frontmatter;
    const html = postNode.html.replace("{{templateLink}}", config.templateLink)
    return (
      <div>
        <Helmet>
          <title>{`${post.title} | ${config.siteTitleInHeader}`}</title>
        </Helmet>
        <SEO postPath={slug} postNode={postNode} postSEO />
        <BodyGrid>
          <HeaderContainer>
            <SiteHeader location={this.props.location} />
          </HeaderContainer>
          <ToCContainer>
            <TableOfContents
              posts={this.props.data.allPostTitles.edges}
              contentsType="doc"
            />
          </ToCContainer>
          <BodyContainer>
            <div>
              <h1>
                {post.title}
              </h1>
              <div dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          </BodyContainer>
        </BodyGrid>
      </div>
    );
  }
}

const BodyGrid = styled.div`
  height: 100vh;
  display: grid;
  grid-template-rows: 75px 1fr;
  grid-template-columns: 300px 1fr;
`

const BodyContainer = styled.div`
  grid-column: 2 / 3;
  grid-row: 2 / 3;
  overflow: scroll;
  justify-self: center;
  width: 100%;
  padding: ${props => props.theme.sitePadding};
  
  & > div {
    max-width: 75%;
    margin: auto;
  }

  p {
    font-size: 1.8rem;
  }
`

const HeaderContainer = styled.div`
  grid-column: 1 / 3;
  grid-row: 1 / 2;
  z-index: 2;
`

const ToCContainer = styled.div`
  grid-column: 1 / 2;
  grid-row: 2 / 3;
  background: ${props => props.theme.gray};
  overflow: scroll;
`

/* eslint no-undef: "off"*/
export const pageQuery = graphql`
  query DocBySlug($slug: String!) {
    allPostTitles: allMarkdownRemark{
      edges {
        node {
          frontmatter {
            title
            group
            type
          }
          fields {
            slug
          }
        }
      }
    }
    postBySlug: markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      timeToRead
      excerpt
      frontmatter {
        title
      }
      fields {
        slug
      }
    } 
  }
`;
