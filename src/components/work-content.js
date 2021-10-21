import * as React from "react"
import { Link } from "gatsby"

const WorkContentComponent = () => {
    return <div>
        <h1 class="mb-3 mt-8"><a name="work"/>Work</h1>
        <div class="flex flex-wrap justify-start work">
          <div class="employment sm:w-3/5">
            <h2 class="mb-3">Employment</h2>
            <h3>Senior Engineering Manager, Core Platform</h3>
            <h4>Quartet Health <span class="text-gray-400 text-sm ml-1">Oct 2018 - Present</span></h4>
            <ul>
              <li>Integration API product design and development</li>
              <li>Internal API design and project management </li>
              <li>Organization and system design</li>
              <li>Team hiring, development and performance management</li>
            </ul>
            <h3>Engineering Manager, Infra, Security, IT</h3>
            <h4>Quartet Health <span class="text-gray-400 text-sm ml-1">Sept 2016 – Oct 2018</span></h4>
            <ul>
              <li>Internal and external audit facilitation</li>
              <li>Compliance automation development</li>
              <li>Team hiring, development and performance management</li>
            </ul>
            <h3>Engineer, Infrastructure</h3>
            <h4>Quartet Health <span class="text-gray-400 text-sm ml-1">Apr 2016 – Sept 2016</span></h4>
            <ul>
              <li>Build, test and deployment automation</li>
              <li>Structured logging and metric collection implementation</li>
              <li>Oranization wide cloud access and resource management</li>
            </ul>
            <h3>Engineer</h3>
            <h4>Welcome (Formerly ChatID) <span class="text-gray-400 text-sm ml-1">Oct 2012 – Apr 2016</span></h4>
            <ul>
              <li>Design, develop and operate system APIs and applications</li>
              <li>Upskill entry level engineers</li>
              <li>Cloud resource automation</li>
            </ul>
            <h3>Technologist</h3>
            <h4>Local Projects <span class="text-gray-400 text-sm ml-1">Aug 2011 – Sep 2012</span></h4>
            <ul>
              <li>Full stack web, mobile and interactive kiosk development</li>
              <li>On-site exhibit installation and support</li>
            </ul>
            <h3>Tech Lead</h3>
            <h4>Syrup <span class="text-gray-400 text-sm ml-1">Jan 2011 – July 2011</span></h4>
            <ul>
              <li>Technical project management and development</li>
            </ul>
            <h3>Senior Developer</h3>
            <h4>Rokkan <span class="text-gray-400 text-sm ml-1">Oct 2005 – Jan 2011</span></h4>
            <ul>
              <li>Rich, interactive marketing media development</li>
            </ul>
            <h3>Designer, Developer</h3>
            <h4>2ndNature<span class="text-gray-400 text-sm ml-1">Nov 2003 – Oct 2005</span></h4>
            <ul>
              <li>Website design and development</li>
              <li>Interactive kiosk development and installation</li>
              <li>Identity design and print production</li>
            </ul>
          </div>
          <div class="open-source sm:w-2/5">
            <h2>Open Source</h2>
            <ul>
              <li>Author, <a href="https://github.com/mattupstate/flask-security">Flask-Security</a>, 2012-2017</li>
              <li>Author, <a href="https://github.com/mattupstate/flask-social">Flask-Social</a>, 2012-2013</li>
              <li>Author, <a href="https://github.com/mattupstate/spring-social-foursquare">Spring Social Foursquare</a>, 2011</li>
              <li>Author, <a href="https://github.com/mattupstate/spring-social-instagram">Spring Social Instagram</a>, 2011</li>
              <li>Maintainer, <a href="https://github.com/mattupstate/flask-principal">Flask-Princpal</a>, 2012-2015</li>
              <li>Maintainer, <a href="https://github.com/mattupstate/flask-mail">Flask-Mail</a>, 2012-2014</li>
              <li>Contributor, <a href="https://github.com/ansible/ansible/search?q=author%3Amattupstate">Ansible</a></li>
              <li>Contributor, <a href="https://github.com/pallets/flask/search?q=author%3Amattupstate">Flask</a></li>
            </ul>
            <h2>Talks</h2>
            <ul>
              <li><Link to="">Python Apps and Docker</Link>, PyGotham, 2014</li>
              <li><Link to="">Deploying Flask/WSGI Applications</Link>, Flask-NYC, 2014</li>
              <li><Link to="">Testing Flask Applications</Link>, Flask-NYC, 2014</li>
            </ul>
            <h2>Publishing</h2>
            <ul>
              <li>Coauthor, <a href="https://www.wiley.com/en-us/Adobe+AIR%3A+Create+Modify+Reuse-p-9780470383087">Adobe Air: Create - Modify - Reuse</a>, 2008</li>
            </ul>
          </div>
        </div>
    </div>
}

export default WorkContentComponent