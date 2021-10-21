import * as React from "react"
import { graphql } from "gatsby"
import { OutboundLink } from "gatsby-plugin-google-analytics"
import { StaticImage } from "gatsby-plugin-image"

import FooterComponent from "../components/footer"
import NavComponent from "../components/nav"
import SiteMetaData from "../components/seo"

const EtcPage = ({
  data: {
    metaImageFile,
  },
}) => {
  return (
    <div>
      <SiteMetaData title="Etc" slug="/etc" description="Extra information about Matt Wright" image={metaImageFile} />
      <NavComponent></NavComponent>
      <div class="pt-6 pl-10 pr-10 max-w-3xl mx-auto etc">
        <h1 class="mb-3">Etc</h1>
        <hr class="mb-3" />
        <div class="flex flex-wrap justify-start">
          <div class="sm:w-3/5 pr-8">
            <h2>Bio</h2>
            <p>
              Matt loves design and technology. 
              Early in his career he aimed to be a designer after receiving a BFA in Graphic Design from <OutboundLink href="https://rit.edu">Rochester Institute of Technology</OutboundLink>.
              However, his early interest in computers led him to eventually become more technology focused over the course of his 20+ year career.
              From 2005-2012, Matt developed web and mobile content for the likes of Virgin America, Elektra Records, Umbro, 2K Games, Speedo and the Cleveland Museum of Art.
              In 2011, after learning Python, he developed an interest in the Open Source Software movement.
              It wasn't long before Matt was contributing to projects and authoring some of his own.
              Most recently Matt has been focused on developing team management, organization design, and leadership skills to help round out his skillset.
              Interested in working with Matt? <a href="mailto:hello@mattupstate.com">Say hello</a>!
            </p>            
            <h2 class="mb-3">Social</h2>
            <ul class="social">
              <li><a href="mailto:hello@mattupstate.com">Email</a></li>
              <li><OutboundLink href="https://github.com/mattupstate">GitHub</OutboundLink></li>
              <li><OutboundLink href="https://twitter.com/mattupstate">Twitter</OutboundLink></li>
              <li><OutboundLink href="https://www.linkedin.com/in/matthewdwright">LinkedIn</OutboundLink></li>
              <li><OutboundLink href="https://keybase.io/mattupstate">Keybase</OutboundLink></li>
              <li><OutboundLink href="https://news.ycombinator.com/user?id=mattupstate">Hacker News</OutboundLink></li>
              <li><OutboundLink href="https://discogs.com/user/mattupstate">Discogs</OutboundLink></li>
            </ul>
          </div>
          <div class="sm:w-2/5">
            <StaticImage src="../images/headshot-lg.jpg" class="float-right border-2" alt="Headshot of Matt"/>  
          </div>
        </div>
      </div>
      <FooterComponent/>
    </div>
  )
}

export default EtcPage

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
