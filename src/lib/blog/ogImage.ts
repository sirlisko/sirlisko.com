import { getImage } from "astro:assets";
import type { ImageMetadata } from "astro";
import { OG_IMAGE_SIZE } from "./ogCard";

/** A post's own cover, cut to the share card's shape. */
export const cropOgImage = async (image: ImageMetadata) => {
	// The image service never enlarges, so a smaller image gets a smaller crop.
	const scale = Math.min(
		1,
		image.width / OG_IMAGE_SIZE.width,
		image.height / OG_IMAGE_SIZE.height,
	);
	const width = Math.round(OG_IMAGE_SIZE.width * scale);
	const height = Math.round(OG_IMAGE_SIZE.height * scale);

	const { src } = await getImage({
		src: image,
		width,
		height,
		fit: "cover",
		// Keeps transparency in logos, and photos stay small.
		format: image.format === "png" ? "png" : "jpg",
	});

	return { src, width, height };
};
