import * as React from "react"
import { Link } from "gatsby";

const FooterComponent = () => {
    return <div class="pl-10 pr-10 pt-6 max-w-3xl mx-auto text-center text-xs mb-5 font-mono">
        <hr class="mt-8 mb-3"/>
        Copyright © Matthew Wright 2021<br/>
        Built with <Link to="https://www.gatsbyjs.com/">Gatsby</Link>, <Link to="https://tailwindcss.com/">tailwindcss</Link> &amp; <Link to="https://pages.github.com/">GitHub Pages</Link>
    </div>
}

export default FooterComponent