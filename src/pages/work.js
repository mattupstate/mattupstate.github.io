import * as React from "react"
import { Link, graphql } from "gatsby";
import { OutboundLink } from "gatsby-plugin-google-gtag"

import FooterComponent from "../components/footer"
import NavComponent from "../components/nav"
import SiteMetaData from "../components/seo"

const WorkPage = ({
  data: {
    metaImageFile,
  },
}) => {
  return (
    <div>
      <SiteMetaData title="Work" slug="/work" description="Matt Wright's employment and work experience." image={metaImageFile} />
      <NavComponent></NavComponent>
      <div class="pt-6 pl-10 pr-10 max-w-3xl mx-auto work">
        <h1 class="mb-3">Work</h1>
        <hr class="mb-3" />
        <div class="flex flex-wrap justify-start">
          <div class="employment sm:w-3/5">
            <h2 class="mb-3">Employment</h2>
            <h3>Engineering Director, Backend & DevOps</h3>
            <h4>Noteable.io <span class="employment-duration">March 2022 - Present</span></h4>
            <ul>
              <li>Coach autonomous, self driven engineering teams</li>
              <li>Support engineer growth and development</li>
              <li>Drive system observability improvements</li>
              <li>Provide developer tools and improved experiences</li>
            </ul>
            <h3>Engineering Director, Core Platform</h3>
            <h4>Quartet Health <span class="employment-duration">Oct 2018 - March 2022</span></h4>
            <ul>
              <li>Integration API product design and development</li>
              <li>Internal API design and project management </li>
              <li>Organization and system design</li>
              <li>Hiring, development and performance management</li>
            </ul>
            <h3>Engineering Manager, Infra, Security, IT</h3>
            <h4>Quartet Health <span class="employment-duration">Sept 2016 – Oct 2018</span></h4>
            <ul>
              <li>Internal and external audit facilitation</li>
              <li>Compliance automation development</li>
              <li>Hiring, development and performance management</li>
            </ul>
            <h3>Engineer, Infrastructure</h3>
            <h4>Quartet Health <span class="employment-duration">Apr 2016 – Sept 2016</span></h4>
            <ul>
              <li>Build, test and deployment automation</li>
              <li>Structured logging and metric collection implementation</li>
              <li>Oranization wide cloud access and resource management</li>
            </ul>
            <h3>Engineer</h3>
            <h4>Welcome (Formerly ChatID) <span class="employment-duration">Oct 2012 – Apr 2016</span></h4>
            <ul>
              <li>Design, develop and operate system APIs and applications</li>
              <li>Upskill entry level engineers</li>
              <li>Cloud resource automation</li>
            </ul>
            <h3>Technologist</h3>
            <h4>Local Projects <span class="employment-duration">Aug 2011 – Sep 2012</span></h4>
            <ul>
              <li>Full stack web, mobile and interactive kiosk development</li>
              <li>On-site exhibit installation and support</li>
            </ul>
            <h3>Tech Lead</h3>
            <h4>Syrup <span class="employment-duration">Jan 2011 – July 2011</span></h4>
            <ul>
              <li>Technical project management and development</li>
            </ul>
            <h3>Senior Developer</h3>
            <h4>Rokkan <span class="employment-duration">Oct 2005 – Jan 2011</span></h4>
            <ul>
              <li>Web marketing and microsite development</li>
              <li>Content management system development</li>
              <li>Full stack web application development</li>
            </ul>
            <h3>Designer, Developer</h3>
            <h4>2ndNature<span class="employment-duration">Nov 2003 – Oct 2005</span></h4>
            <ul>
              <li>Website design and development</li>
              <li>Interactive kiosk development and installation</li>
              <li>Identity design and print production</li>
            </ul>
          </div>
          <div class="open-source sm:w-2/5">
            <h2>Open Source</h2>
            <ul>
              <li>Author, <OutboundLink href="https://github.com/mattupstate/flask-security">Flask-Security</OutboundLink>, 2012-2017</li>
              <li>Author, <OutboundLink href="https://github.com/mattupstate/flask-social">Flask-Social</OutboundLink>, 2012-2013</li>
              <li>Author, <OutboundLink href="https://github.com/mattupstate/spring-social-foursquare">Spring Social Foursquare</OutboundLink>, 2011</li>
              <li>Author, <OutboundLink href="https://github.com/mattupstate/spring-social-instagram">Spring Social Instagram</OutboundLink>, 2011</li>
              <li>Maintainer, <OutboundLink href="https://github.com/mattupstate/flask-principal">Flask-Princpal</OutboundLink>, 2012-2015</li>
              <li>Maintainer, <OutboundLink href="https://github.com/mattupstate/flask-mail">Flask-Mail</OutboundLink>, 2012-2014</li>
              <li>Contributor, <OutboundLink href="https://github.com/ansible/ansible/search?q=author%3Amattupstate">Ansible</OutboundLink></li>
              <li>Contributor, <OutboundLink href="https://github.com/pallets/flask/search?q=author%3Amattupstate">Flask</OutboundLink></li>
            </ul>
            <h2>Talks</h2>
            <ul>
              <li><Link to="/talks">Python Apps and Docker</Link>, PyGotham, 2014</li>
              <li><Link to="/talks">Deploying Flask Applications</Link>, Flask-NYC, 2014</li>
              <li><Link to="/talks">Testing Flask Applications</Link>, Flask-NYC, 2014</li>
            </ul>
            <h2>Publishing</h2>
            <ul>
              <li>Coauthor, <OutboundLink href="https://www.wiley.com/en-us/Adobe+AIR%3A+Create+Modify+Reuse-p-9780470383087">Adobe Air: Create - Modify - Reuse</OutboundLink>, Wiley/WROX 2008</li>
            </ul>
            <h2>Tools &amp; Tech</h2>
            <ul>
              <li>Python, Kotlin, Java, Typescript</li>
              <li>Flask, Ktor, Spring Boot</li>
              <li>PostgreSQL, Alembic, Liquibase</li>
              <li>Terraform, Docker, Kubernetes, AWS</li>
              <li>OpenTelemetry, Sentry, Snowplow</li>
            </ul>
          </div>
        </div>
      </div>
      <FooterComponent />
    </div>
  )
}

export default WorkPage

export const pageQuery = graphql`
  query {
    metaImageFile: file(relativePath: { eq: "images/headshot-summary.png" }) {
      relativePath
      childImageSharp {
        gatsbyImageData
      }
    }
  }
`
