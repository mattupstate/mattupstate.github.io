import * as React from "react"
import { graphql } from "gatsby"
import { OutboundLink } from "gatsby-plugin-google-gtag"

import FooterComponent from "../components/footer"
import NavComponent from "../components/nav"
import SiteMetaData from "../components/seo"

const TalksPage = ({
  data: {
    metaImageFile,
  },
}) => {
  return (
    <div>
      <SiteMetaData title="Talks" slug="/talks" description="Talks and presentations given by Matt" image={metaImageFile} />
      <NavComponent></NavComponent>
      <div class="pt-6 pl-10 pr-10 max-w-3xl mx-auto talks">
        <h1 class="mb-3">Talks</h1>
        <hr class="mb-3" />
        <div class="flex flex-wrap">
          <div class="talk-item">
            <h2>Python Apps and Docker</h2>
            <p>Presented on August 16, 2014 @ <OutboundLink href="https://2021.pygotham.tv/">PyGotham</OutboundLink></p>
            <iframe title="Python Apps and Docker Video" width="764" height="430" src="//www.youtube.com/embed/qeqk4xMloS0" frameborder="0" allowfullscreen="" style={{border: 0, background: 'padding-box rgba(0, 0, 0, 0.1)', margin: 0, padding: 0, borderRadius: 6, boxShadow: 'rgba(0, 0, 0, 0.2) 0px 5px 40px', width: 764, height: 430, marginBottom: 15}}></iframe>
            <iframe title="Python Apps and Docker Slides" src="//speakerdeck.com/player/96728810086a01325dcb621608dcfe22?" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" style={{border: 0, background: 'padding-box rgba(0, 0, 0, 0.1)', margin: 0, padding: 0, borderRadius: 6, boxShadow: 'rgba(0, 0, 0, 0.2) 0px 5px 40px', width: 764, height: 430}}></iframe>
          </div>         
          <div class="talk-item">
            <h2>Deploying Flask/WSGI Applications</h2>
            <p>Presented on June 25, 2014 @ <OutboundLink href="https://twitter.com/flasknyc">Flask-NYC</OutboundLink></p>
            <iframe title="Deploying Flask/WSGI Applications Slides" frameborder="0" src="//speakerdeck.com/player/207978c0def3013128d81ecb83560054?" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" style={{border: 0, background: 'padding-box rgba(0, 0, 0, 0.1)', margin: 0, padding: 0, borderRadius: 6, boxShadow: 'rgba(0, 0, 0, 0.2) 0px 5px 40px', width: 764, height: 430}}></iframe>
          </div>
          <div class="talk-item">
            <h2>Testing Flask Applications</h2>
            <p>Presented on April 24, 2014 @ <OutboundLink href="https://twitter.com/flasknyc">Flask-NYC</OutboundLink></p>
            <iframe title="Testing Flask Applications Slides" frameborder="0" src="//speakerdeck.com/player/2ec67e00ae3c013156984eab6e1d3af5?" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" style={{border: 0, background: 'padding-box rgba(0, 0, 0, 0.1)', margin: 0, padding: 0, borderRadius: 6, boxShadow: 'rgba(0, 0, 0, 0.2) 0px 5px 40px', width: 764, height: 430}}></iframe>
          </div>
        </div>
      </div>
      <FooterComponent/>
    </div>
  )
}

export default TalksPage

export const pageQuery = graphql`
  query {
    metaImageFile: file(relativePath: { eq: "images/headshot-summary.jpg" }) {
      relativePath
      childImageSharp {
        gatsbyImageData
      }
    }
  }
`
