import React from "react"
import Link from 'gatsby-link'
import styled from 'styled-components'

// the entry must be the member of these groups.
const groups = [
  'Basic Usage',
  'Advanced Usage',
  'Internals'
];

class TableOfContents extends React.Component {
  buildNodes() {
    const {posts} = this.props
    const type = this.props.contentsType
    const postNodes = []
    posts.forEach(post => {
      if (post.node.frontmatter.type === type && groups.includes(post.node.frontmatter.group)) {
        const postNode = {
          title: post.node.frontmatter.title,
          path: post.node.fields.slug,
          group: post.node.frontmatter.group
        };
        postNodes.push(postNode);
      }
    })

    const postNodeGroups = {};
    postNodes.forEach(post => {
      if (postNodeGroups[post.group]) {
        postNodeGroups[post.group].push(post)
      } else {
        postNodeGroups[post.group] = [post]
      }
    })

    Object.keys(postNodeGroups).forEach(groupName => {
      postNodeGroups[groupName].sort((a, b) => a.title > b.title)
    })
    return postNodeGroups
  }

  nodeListItems() {
    const postNodeGroups = this.buildNodes()
    const listItems = []
    groups.forEach(groupName => {
      const nodesInGroup = postNodeGroups[groupName]
      const groupDocs = []
      nodesInGroup.forEach(node => {
        groupDocs.push(
          <DocContainer>
            <Link to={node.path}>
              <li>
                <span>
                  <h6>{node.title}</h6>
                </span>
              </li>
            </Link>
          </DocContainer>
        )
      })
      listItems.push(
        <li className='chapter'>
          <h5 className='tocHeading'>
            {groupName}
          </h5>
          <ul className='chapterItems'>
            {groupDocs}
          </ul>
        </li>
      )
    })
    return listItems
  }

  render() {
    return (
      <TableOfContentsContainer>
        <ul>
          {this.nodeListItems()}
        </ul>
      </TableOfContentsContainer>
    )
  }
}

const TableOfContentsContainer = styled.div`
  padding: ${props => props.theme.sitePadding};

  & > ul, .chapterItems {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  p, h6 {
    display: inline-block;
    font-weight: 200;
    margin: 0;
  }
  
  .tocHeading {
     font-weight: 200;
     color: ${props => props.theme.brand};
     margin-bottom: 10px;
  }

  @media screen and (max-width: 768px) {
    padding: 0px;
  }
`

const DocContainer = styled.div`
  h6, p {
    color: ${props => props.theme.ink};
    margin: 0;
    line-height: 1.5;
  }
  li {
    margin: 0;
  }
  &:hover {
    li {
      span {
        border-bottom: 1px solid ${props => props.theme.ink};
      }
    }
  }
`

export default TableOfContents

