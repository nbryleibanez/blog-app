import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function NavBar() {
  return (
    <nav className="bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold text-primary">
                Blog
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/" className="text-foreground hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </Link>
                <Link href="/about" className="text-muted-foreground hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-md text-sm font-medium">
                  About
                </Link>
                <Link href="/services" className="text-muted-foreground hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-md text-sm font-medium">
                  Services
                </Link>
                <Link href="/contact" className="text-muted-foreground hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-md text-sm font-medium">
                  Contact
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <Button>
              <Link href="/create-post">Create new post</Link>
            </Button>
          </div>
          {/* <div className="-mr-2 flex md:hidden"> */}
          {/*   <Button variant="ghost" onClick={toggleMenu} aria-label="Toggle menu"> */}
          {/*     {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />} */}
          {/*   </Button> */}
          {/* </div> */}
        </div>
      </div>

      {/* {isMenuOpen && ( */}
      {/*   <div className="md:hidden"> */}
      {/*     <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3"> */}
      {/*       <Link href="/" className="text-foreground hover:bg-accent hover:text-accent-foreground block px-3 py-2 rounded-md text-base font-medium"> */}
      {/*         Home */}
      {/*       </Link> */}
      {/*       <Link href="/about" className="text-muted-foreground hover:bg-accent hover:text-accent-foreground block px-3 py-2 rounded-md text-base font-medium"> */}
      {/*         About */}
      {/*       </Link> */}
      {/*       <Link href="/services" className="text-muted-foreground hover:bg-accent hover:text-accent-foreground block px-3 py-2 rounded-md text-base font-medium"> */}
      {/*         Services */}
      {/*       </Link> */}
      {/*       <Link href="/contact" className="text-muted-foreground hover:bg-accent hover:text-accent-foreground block px-3 py-2 rounded-md text-base font-medium"> */}
      {/*         Contact */}
      {/*       </Link> */}
      {/*     </div> */}
      {/*     <div className="pt-4 pb-3 border-t border-muted"> */}
      {/*       <Button className="w-full">Sign In</Button> */}
      {/*     </div> */}
      {/*   </div> */}
      {/* )} */}
    </nav>
  )
}
