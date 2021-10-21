import React from "react"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"
import { getImage, getSrc } from "gatsby-plugin-image"

function SiteMetaData({ description, lang, meta, title, slug, image }) {
  console.log(image)
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
            keywords
            siteUrl
          }
        }

      }
    `
  )

  const metaDescription = description || site.siteMetadata.description
  const canonical = slug ? `${site.siteMetadata.siteUrl}${slug}` : null
  const imageData = image ? getImage(image) : null
  const imageUrl = image ? `${site.siteMetadata.siteUrl}${getSrc(image)}` : null

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      link={
        canonical
          ? [
              {
                rel: "canonical",
                href: canonical,
              },
            ]
          : []
      }
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          name: "keywords",
          content: site.siteMetadata.keywords.join(","),
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata.author,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ]
        .concat(
            imageData
            ? [
                {
                  property: "og:image",
                  content: imageUrl,
                },
                {
                  property: "og:image:width",
                  content: imageData.width,
                },
                {
                  property: "og:image:height",
                  content: imageData.height,
                },
                {
                  name: "twitter:card",
                  content: "summary_large_image",
                },
              ]
            : [
                {
                  name: "twitter:card",
                  content: "summary",
                },
              ]
        )
        .concat(meta)}
    />
  )
}

SiteMetaData.defaultProps = {
  lang: "en",
  meta: [],
  description: ""
}

export default SiteMetaData