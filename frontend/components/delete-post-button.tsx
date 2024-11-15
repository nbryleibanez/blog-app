"use client"

import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function DeletePostButton({ id }: { id: string }) {
  const router = useRouter()

  const handleSubmit = async () => {
    const res = await fetch(`http://127.0.0.1:5000/posts/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
    })

    if (!res.ok) {
      toast('Something went wrong.', {
        description: "We're fixing it, Houston",
      })
      return
    }

    toast('Post deleted')
    router.push('/')
    router.refresh()
  }

  return <Button onClick={handleSubmit}>Delete</Button>
}
