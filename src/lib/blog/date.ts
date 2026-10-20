const MONTHS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

/**
 * "8 May 2026", in the zone the post was written in. The month names are
 * spelled out here because ICU's en-GB "Sept" would change every September date.
 */
export const formatPostDate = (date: Date, timeZone: string): string => {
	const parts = Object.fromEntries(
		new Intl.DateTimeFormat("en-GB", {
			day: "numeric",
			month: "numeric",
			year: "numeric",
			timeZone,
		})
			.formatToParts(date)
			.map(({ type, value }) => [type, value]),
	);
	return `${Number(parts.day)} ${MONTHS[Number(parts.month) - 1]} ${parts.year}`;
};
