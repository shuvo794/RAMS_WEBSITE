import { notFound } from "next/navigation"

interface CmsMenu {
  name: string
  value: string
}

interface Post {
  cms_menu: CmsMenu
  name: string
  value: string
}

async function getPost(): Promise<{ menu_items: Post[] }> {
  const res = await fetch(
    `https://api.bluebayit.com/cms_menu_content/api/v1/cms_menu_content/without_pagination/all/`,
    { cache: "force-cache" },
  )

  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }

  const post = await res.json()
  if (!post) notFound()

  return post
}

export default async function ServiceData() {
  const data = await getPost()
  const filteredImages = data.menu_items.filter((menu: Post) => menu.cms_menu.name === "Services")

  return filteredImages
}

