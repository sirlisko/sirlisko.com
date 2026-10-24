import type { Layer, LeafletEvent, Map as LeafletMap } from "leaflet";
import { type Leaflet, loadLeaflet, markFailed } from "./leaflet";

// leaflet-gpx has no exports or types: it hangs GPX off the global L
declare global {
	interface Window {
		L: { GPX: new (url: string, options: object) => Layer };
	}
}

// Colours come from map.css; overview tracks after the first take the next
// class so several days stay apart.
function addGpxTrack(
	map: LeafletMap,
	file: string,
	index: number,
	onLoaded: (e: LeafletEvent) => void,
) {
	new window.L.GPX(file, {
		async: true,
		polyline_options: {
			className: `map-track map-track-${index % 3}`,
			weight: 3,
		},
		markers: { startIcon: null, endIcon: null },
	})
		.on("loaded", onLoaded)
		.addTo(map);
}

function initOverview(leaflet: Leaflet, el: HTMLElement) {
	const files: string[] = JSON.parse(el.dataset.gpxTracks ?? "[]");
	const { gpxBounds } = el.dataset;
	if (!files.length || !gpxBounds) return;

	const map = leaflet.createMap(el);
	map.fitBounds(JSON.parse(gpxBounds), { padding: [20, 20] });
	const bounds = leaflet.L.latLngBounds([]);
	let loaded = 0;

	files.forEach((file, index) => {
		addGpxTrack(map, file, index, (e) => {
			bounds.extend(e.target.getBounds());
			loaded++;
			if (loaded === files.length) {
				map.fitBounds(bounds, { padding: [20, 20] });
				map.invalidateSize();
			}
		});
	});
}

// Every walk on one map: each post keeps one colour, and its tracks lead to it.
function initWalks(leaflet: Leaflet, el: HTMLElement) {
	const tracks: { file: string; title: string; url: string }[] = JSON.parse(
		el.dataset.gpxWalks ?? "[]",
	);
	const { gpxBounds } = el.dataset;
	if (!tracks.length || !gpxBounds) return;

	const map = leaflet.createMap(el);
	map.fitBounds(JSON.parse(gpxBounds), { padding: [20, 20] });
	const posts = [...new Set(tracks.map(({ url }) => url))];

	for (const { file, title, url } of tracks) {
		addGpxTrack(map, file, posts.indexOf(url), (e) => {
			e.target
				.bindTooltip(title, { sticky: true, className: "route-map-label" })
				.on("click", () => {
					window.location.href = url;
				});
		});
	}
}

// Per-day inline maps sit in the prose, whose centred images would shift
// tiles off their grid, so they opt out.
function initInline(leaflet: Leaflet, el: HTMLElement) {
	const file = el.dataset.gpxMap;
	if (!file) return;

	el.classList.add("not-prose");
	el.style.position = "relative";
	const map = leaflet.createMap(el);
	addGpxTrack(map, file, 0, (e) => {
		map.fitBounds(e.target.getBounds(), { padding: [20, 20] });
		map.invalidateSize();
	});
}

export async function initGpxMaps() {
	const overview = document.querySelector<HTMLElement>("[data-gpx-tracks]");
	const walks = document.querySelector<HTMLElement>("[data-gpx-walks]");
	const inline = Array.from(
		document.querySelectorAll<HTMLElement>("[data-gpx-map]"),
	);
	const els = [overview, walks, ...inline].filter((el) => el !== null);
	if (!els.length) return;

	let leaflet: Leaflet;
	try {
		leaflet = await loadLeaflet();
		await import("leaflet-gpx");
	} catch {
		markFailed(els);
		return;
	}

	if (overview) initOverview(leaflet, overview);
	if (walks) initWalks(leaflet, walks);
	for (const el of inline) {
		initInline(leaflet, el);
	}
}
