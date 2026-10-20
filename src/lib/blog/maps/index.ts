import { initGpxMaps } from "./gpx";
import { snapMapsToPixelGrid } from "./leaflet";
import { initRouteMaps } from "./routes";

document.addEventListener("astro:page-load", async () => {
	await Promise.all([initGpxMaps(), initRouteMaps()]);
	snapMapsToPixelGrid();
	document.fonts.ready.then(snapMapsToPixelGrid);
});

window.addEventListener("resize", snapMapsToPixelGrid);
