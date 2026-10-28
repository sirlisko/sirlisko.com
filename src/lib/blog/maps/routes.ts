import type { LatLngTuple } from "leaflet";
import { type Leaflet, loadLeaflet, markFailed } from "./leaflet";

interface Stop {
	name: string;
	lat: number;
	lng: number;
	mode?: string;
	label?: Direction;
}

type Direction = "top" | "bottom" | "left" | "right";
const LABEL_OFFSETS: Record<Direction, [number, number]> = {
	top: [0, -6],
	bottom: [0, 6],
	left: [-6, 0],
	right: [6, 0],
};

// Route overview maps: markers and lines between stops, styled by travel
// mode, for multi-leg trip posts. Colours come from the route-leg-<mode>
// classes in map.css.
const BUS = { dashArray: "8 6", label: "Bus / van" };
const MODES: Record<string, { dashArray: string | null; label: string }> = {
	train: { dashArray: null, label: "Train" },
	bus: BUS,
	flight: { dashArray: "2 8", label: "Flight" },
	boat: { dashArray: "1 8 6 8", label: "Boat" },
	foot: { dashArray: "4 4", label: "On foot" },
};

function parseStops(el: HTMLElement): Stop[] {
	try {
		const stops = JSON.parse(el.dataset.routeMap ?? "");
		return Array.isArray(stops) ? stops : [];
	} catch {
		return [];
	}
}

function renderLegend(el: HTMLElement, modes: Set<string>) {
	const legend = document.createElement("div");
	legend.className = "route-map-legend not-prose";
	legend.innerHTML = Array.from(modes)
		.map((mode) => {
			const { dashArray, label } = MODES[mode] ?? BUS;
			const dash = dashArray ? `stroke-dasharray="${dashArray}"` : "";
			return `<span><svg width="24" height="4" aria-hidden="true"><line class="route-leg route-leg-${mode}" x1="0" y1="2" x2="24" y2="2" stroke-width="3" ${dash} /></svg>${label}</span>`;
		})
		.join("");
	el.insertAdjacentElement("afterend", legend);
}

function initRouteMap({ L, createMap }: Leaflet, el: HTMLElement) {
	const stops = parseStops(el);
	if (!stops.length) return;

	el.classList.add("not-prose");
	el.style.position = "relative";
	const map = createMap(el);
	const bounds = L.latLngBounds([]);
	const usedModes = new Set<string>();
	const labelled = new Set<string>();

	stops.forEach((stop, idx) => {
		const latlng: LatLngTuple = [stop.lat, stop.lng];
		bounds.extend(latlng);

		const marker = L.circleMarker(latlng, {
			radius: 6,
			weight: 2,
			className: "route-stop",
		}).addTo(map);
		// A round trip passes its start again; a second label would sit on the first.
		if (!labelled.has(stop.name)) {
			labelled.add(stop.name);
			const direction = stop.label ?? "top";
			marker.bindTooltip(stop.name, {
				permanent: true,
				direction,
				offset: LABEL_OFFSETS[direction] ?? LABEL_OFFSETS.top,
				className: "route-map-label",
			});
		}

		const prev = stops[idx - 1];
		if (!prev) return;
		const mode = stop.mode && MODES[stop.mode] ? stop.mode : "bus";
		usedModes.add(mode);
		L.polyline([[prev.lat, prev.lng], latlng], {
			className: `route-leg route-leg-${mode}`,
			weight: 3,
			dashArray: MODES[mode]?.dashArray ?? undefined,
		}).addTo(map);
	});

	map.fitBounds(bounds, { padding: [30, 30] });
	map.invalidateSize();
	if (usedModes.size) renderLegend(el, usedModes);
}

export async function initRouteMaps() {
	const els = Array.from(
		document.querySelectorAll<HTMLElement>("[data-route-map]"),
	);
	if (!els.length) return;

	let leaflet: Leaflet;
	try {
		leaflet = await loadLeaflet();
	} catch {
		markFailed(els);
		return;
	}

	for (const el of els) {
		initRouteMap(leaflet, el);
	}
}
