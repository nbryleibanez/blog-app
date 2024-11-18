'use client'

import { useState } from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from 'lucide-react'
import SearchForm from "./search-form"

export default function MobileMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
      </Button>
      {isMenuOpen && (
        <div className="absolute left-0 right-0 top-16 bg-background p-4 shadow-md">
          <SearchForm />
          <Button asChild className="w-full justify-start mt-2">
            <Link href="/create-post">Create new post</Link>
          </Button>
        </div>
      )}
    </>
  )
}
