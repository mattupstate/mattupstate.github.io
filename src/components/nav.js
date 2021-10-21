import * as React from "react"

// styles


// markup
const NavComponent = () => {
  return (
    <nav class="p-4 bg-gray-50 font-mono navbar">
      <div class="sm:flex sm:justify-between max-w-3xl mx-auto">
        <div>$ <a class="hover:text-gray-500" href="/">matt</a></div>
        <div class="pl-5 pt-2 sm:pl-0 sm:pt-0">
            <a class="mr-3 hover:text-gray-500" href="/work">~/work</a>
            <a class="mr-3 hover:text-gray-500" href="/talks">~/talks</a>
            <a class="mr-0 hover:text-gray-500" href="/etc">~/etc</a>          
        </div>
      </div>
    </nav>
  )
}

export default NavComponent
