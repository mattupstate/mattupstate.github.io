import * as React from "react"
import { Link, graphql } from "gatsby"

import FooterComponent from "../components/footer";
import NavComponent from "../components/nav";
import SiteMetaData from "../components/seo"

const IndexPage = ({
  data: {
    allMarkdownRemark: { edges },
    metaImageFile,
  },
}) => {
  const blogPosts = edges
    .filter(edge => !!edge.node.frontmatter.date)
    .map(edge => <div>
      <Link to={edge.node.frontmatter.slug}>{edge.node.frontmatter.title}</Link>
      <div class="text-xs text-gray-600 font-mono">{edge.node.frontmatter.date}</div>
    </div>);

  return (
    <div>
      <SiteMetaData title="Home" slug="/" image={metaImageFile} />
      <NavComponent/>
      <div class="pl-10 pr-10 pt-6 max-w-3xl mx-auto blog-links">
        <h1 class="mb-3">Blog</h1>
        <ul>
          {blogPosts.map((post) => {
            return <li class="pb-3">{post}</li>
          })}
        </ul>
      </div>
      <FooterComponent/>
    </div>
  )
}

export default IndexPage

export const pageQuery = graphql`
  query {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          id
          excerpt(pruneLength: 250)
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            slug
            title
          }
        }
      }
    }
    metaImageFile: file(relativePath: { eq: "images/headshot-summary.jpg" }) {
      relativePath
      childImageSharp {
        gatsbyImageData
      }
    }
  }
`