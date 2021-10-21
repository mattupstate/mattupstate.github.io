import React from "react"
import { graphql } from "gatsby"
import NavComponent from "../components/nav"
import FooterComponent from "../components/footer"
import SiteMetaData from "../components/seo"

export default function Template({ data }) {
  const { markdownRemark, metaImageFile } = data;
  const { frontmatter, html } = markdownRemark;
  
  return (
    <div>
      <SiteMetaData
          title={frontmatter.title}
          slug={frontmatter.slug}
          description={frontmatter.description}
          image={metaImageFile}
        />
      <NavComponent></NavComponent>
      <div class="pl-10 pr-10 pt-6 max-w-3xl mx-auto blog-post">
        <h1 class="mb-1">{frontmatter.title}</h1>
        <h5 class="mb-3 text-xs text-gray-500 font-mono">Published on {frontmatter.date}</h5>
        <hr class="mb-3"/>
        <div dangerouslySetInnerHTML={{ __html: html }}/>
      </div>
      <FooterComponent/>
    </div>
  )
}

export const pageQuery = graphql`
  query($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        slug
        title
        description
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