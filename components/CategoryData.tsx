import { BASE_URL } from "@/lib/config";
import { dataFetcher } from "@/lib/dataFetcher";

interface ContentImage {
  id: number;
  cms_menu: {
    id: number;
    name: string;
    parent: null;
  };
  head: string;
  image: string;
}

export async function getCategoryData() {
  try {
    const data = await dataFetcher(
      `${BASE_URL}/cms_menu_content_image/api/v1/cms_menu_content_image/without_pagination/all/`
    );
    const filteredImages = data.content_images.filter(
      (img: ContentImage) => img.head === "Brand"
    );

    return filteredImages.map((img: ContentImage) => ({
      ...img,
      imageName: getImageName(img.image),
    }));
  } catch (error) {
    console.error("Error fetching category data:", error);
    return [];
  }
}

function getImageName(imagePath: string): string {
  const filename = imagePath.split("/").pop() || "";
  const filenames = filename
    .split(".")[0]
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .replace(/Logo/gi, "")
    .trim();

  return filenames;
}
