import Link from "next/link"
import { cookies } from "next/headers"
import SearchForm from "@/components/search-form"
import MobileMenu from "@/components/mobile-menu"
import AvatarButton from "@/components/avatar-button"

import { Button } from "@/components/ui/button"
import { CircleUser } from 'lucide-react';

export default async function NavBar() {
  const cookieStore = await cookies()
  const hasAccessToken = cookieStore.has("access_token")

  let name: string | undefined

  if (hasAccessToken) {
    const data = await fetch(`${process.env.API_URL}/users/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${cookieStore.get("access_token")?.value as string}`,
        "Content-Type": "application/json"
      },
    }).then(res => (
      res.json()
    ))

    name = data.name
  }

  return (
    <nav className="bg-background sticky top-0 z-10 shadow-sm" >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              Blog
            </Link>
          </div>
          <div className="hidden md:flex md:items-center md:gap-4">
            <SearchForm />
            {
              hasAccessToken ?
                (
                  <>
                    <Button asChild>
                      <Link href="/create-post">Create new post</Link>
                    </Button>
                    <AvatarButton name={name} />
                  </>
                ) : (
                  <Link href="/login">
                    <CircleUser className="w-10 h-10" />
                  </Link>
                )
            }
          </div>
          <div className="md:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </nav >
  )
}
