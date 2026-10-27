/** Just enough RSS reading for the feeds here, which is cheaper than an XML parser dependency. */
export const xmlItems = (xml: string): string[] =>
	[...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, item = ""]) => item);

export const xmlTag = (item: string, name: string): string | undefined => {
	const value = item.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`))?.[1];
	if (value === undefined) return undefined;
	const cdata = value.match(/^<!\[CDATA\[([\s\S]*)\]\]>$/)?.[1];
	return (cdata ?? value)
		.replaceAll("&#039;", "'")
		.replaceAll("&quot;", '"')
		.replaceAll("&lt;", "<")
		.replaceAll("&gt;", ">")
		.replaceAll("&amp;", "&")
		.trim();
};
