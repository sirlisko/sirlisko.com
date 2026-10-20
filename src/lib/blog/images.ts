// Settles the loading placeholder on post images (see skin.css): cleared once
// an image arrives, swapped for a missing-image mark if it never does.
function settle(img: HTMLImageElement) {
	img.dataset.imageState = img.naturalWidth > 0 ? "loaded" : "failed";
}

function track(img: HTMLImageElement) {
	// Lazy images not yet requested aren't complete, so they wait for an event
	if (img.complete) {
		settle(img);
		return;
	}
	img.addEventListener("load", () => settle(img), { once: true });
	img.addEventListener("error", () => settle(img), { once: true });
}

document.addEventListener("astro:page-load", () => {
	document
		.querySelectorAll<HTMLImageElement>(
			// A state set in the markup is pinned, as on /style
			"#article img:not(.leaflet-container img, [data-image-state])",
		)
		.forEach(track);
});
