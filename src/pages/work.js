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
            <h3>Engineering Manager</h3>
            <h4>Noteable.io <span class="employment-duration">Mar 2022 - Dec 2023 (end of operations)</span></h4>
            <ul>
              <li>Managed 8 backend engineers and 4 platform engineers</li>
              <li>Oversaw delivery of <OutboundLink href="https://www.kdnuggets.com/2023/06/noteable-plugin-chatgpt-plugin-automates-data-analysis.html">ChatGPT plugin</OutboundLink> and numerous other features delivered by cross-functional teams</li>
              <li>Lead deployment frequency improvements from every two weeks to on-demand</li>
              <li>Drove qualitative improvement to local development experience resulting in significantly reduced lead times</li>
              <li>Introduced distributed tracing and canonical logs leading to 20% reduction in DataDog costs</li>
            </ul>
            <h3>Engineering Manager, Backend</h3>
            <h4>Quartet Health <span class="employment-duration">Oct 2018 - Mar 2022</span></h4>
            <ul>
              <li>Scaled team of 5 to 10 engineers and 1 additional manager</li>
              <li>Managed two agile cross-functional product development teams</li>
              <li>Lead partner integration API MVP to delivery in under 2 months</li>
              <li>Drove domain-driven design inspired improvements to backend system leading to 80% reduction in change failure rate</li>
            </ul>
            <h3>Engineering Manager, Platform</h3>
            <h4>Quartet Health <span class="employment-duration">Sept 2016 - Oct 2018</span></h4>
            <ul>
              <li>Managed team of 4 platform engineers</li>
              <li>Lead Infrastructure-as-Code adoption and self-service Terraform PR workflows using Atlantis</li>
              <li>Delivered self-service CI/CD workflows on Jenkins</li>
            </ul>
            <h3>Engineer, DevOps</h3>
            <h4>Quartet Health <span class="employment-duration">Apr 2016 - Sept 2016</span></h4>
            <ul>
              <li>Lead migration to container based deployments</li>
              <li>Deployed and operated centralized structured logging and metric services using Elastic stack</li>
            </ul>
            <h3>Engineer</h3>
            <h4>Welcome (Formerly ChatID) <span class="employment-duration">Oct 2012 - Apr 2016</span></h4>
            <ul>
              <li>Owned and operated internal APIs and management console</li>
              <li>Lead adoption of Ansible and Terraform for cloud resource management and operations </li>
              <li>Open source and local Python community relations</li>
            </ul>
            <h3>Engineer</h3>
            <h4>Local Projects <span class="employment-duration">Aug 2011 – Sep 2012</span></h4>
            <ul>
              <li>Lead engineer on numerous web, mobile and touch-screen kiosk applications for clients including University of Florida, SeaWorld, and Cleveland Museum of Art
</li>
            </ul>
            <h3>Tech Lead</h3>
            <h4>Syrup <span class="employment-duration">Jan 2011 – July 2011</span></h4>
            <ul>
              <li>Technical project management and development</li>
            </ul>
            <h3>Senior Developer</h3>
            <h4>Rokkan <span class="employment-duration">Oct 2005 – Jan 2011</span></h4>
            <ul>
              <li>Award winning web application and content development. Clients included 2K Games, Elektra Records, Jose Cuervo, Mitchum, Progressive Auto, Stride Gum, Trident Gum, Umbro, and Virgin America</li>
            </ul>
            <h3>Designer, Developer</h3>
            <h4>2ndNature<span class="employment-duration">Nov 2003 – Oct 2005</span></h4>
            <ul>
              <li>Designer and developer of identity systems, stationery, collateral, interactive CD-ROMs, touch-screen kiosks, and websites for clients such as Welch Allyn, PPC and various local small businesses.</li>
            </ul>
          </div>
          <div class="open-source sm:w-2/5">
            <h2>Tools &amp; Tech</h2>
            <ul>
              <li>Python, Kotlin, Java, Typescript</li>
              <li>Flask, FastAPI, Ktor, Spring Boot</li>
              <li>PostgreSQL, ElasticSearch, Redis</li>
              <li>SQLAlchemy, Alembic, jOOQ, Liquibase</li>
              <li>Terraform, Packer, Ansible, Docker, Helm, Skaffold, Kubernetes, AWS</li>
              <li>DataDog, OpenTelemetry, Sentry</li>
              <li>Selenium, Playwright</li>
              <li>DDD, Event Modeling, CQRS</li>
              <li>Agile, Scrum, Kanban</li>
            </ul>
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
