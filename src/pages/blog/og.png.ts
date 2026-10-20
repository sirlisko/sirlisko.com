import type { APIRoute } from "astro";
import { BLOG } from "../../config";
import { renderGameBoyCard } from "../../lib/blog/ogCard";

export const GET: APIRoute = async () =>
	new Response(
		new Uint8Array(
			await renderGameBoyCard({
				title: "sirlisko",
				subtitle: BLOG.description,
			}),
		),
		{ headers: { "Content-Type": "image/png" } },
	);
