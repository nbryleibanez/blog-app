'use server'

import { cookies } from 'next/headers'
import { revalidateTag, revalidatePath } from 'next/cache'

export async function revalidatePosts() {
  revalidateTag('posts')
}

export async function revalidateComments() {
  revalidateTag('comments')
}

export async function revalidatePost(postId: number) {
  revalidatePath(`/blogs/${postId}`)
}

export async function setCookie(key: string, value: string, maxAge: number) {
  const cookieStore = await cookies()

  cookieStore.set(key, value, {
    sameSite: 'lax',
    maxAge: maxAge,
  })
}

export async function getCookie(key: string): Promise<string> {
  const cookieStore = await cookies()

  return cookieStore.get(key)?.value as string
}

export async function getProfile() {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  const res = await fetch(`${process.env.API_URL}/users/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!res.ok) {
    return null
  }

  return await res.json()
}
