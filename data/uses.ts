export interface UsesApp {
	name: string;
	url: string;
}

export interface UsesItem {
	emoji: string;
	category: string;
	apps: UsesApp[];
	note?: string;
}

export const USES_SOURCE = "https://sirlisko.com/blog/my-default-apps-2024";
export const USES_SOURCE_LABEL = "the original post";

export const uses = [
	{
		emoji: "🌐",
		category: "web browser",
		apps: [{ name: "Zen", url: "https://www.zen-browser.app" }],
		note: "Privacy-focused and clean. See you never, Chromium.",
	},
	{
		emoji: "🔍",
		category: "search engine",
		apps: [{ name: "Kagi", url: "https://kagi.com" }],
		note: "Best upgrade of the year — the quick answers alone are worth it.",
	},
	{
		emoji: "💻",
		category: "code editor",
		apps: [{ name: "VSCode", url: "https://code.visualstudio.com" }],
	},
	{
		emoji: "🚀",
		category: "launcher",
		apps: [{ name: "Raycast", url: "https://www.raycast.com" }],
	},
	{
		emoji: "🔐",
		category: "password manager",
		apps: [{ name: "1Password", url: "https://1password.com" }],
		note: "Mostly for the developer tools.",
	},
	{
		emoji: "📥",
		category: "mail client",
		apps: [{ name: "FastMail", url: "https://www.fastmail.com" }],
	},
	{
		emoji: "✉️",
		category: "mail service",
		apps: [{ name: "FastMail", url: "https://www.fastmail.com" }],
		note: "Masked emails + tight 1Password integration.",
	},
	{
		emoji: "📝",
		category: "notes",
		apps: [
			{
				name: "Apple Notes",
				url: "https://support.apple.com/guide/notes/welcome/mac",
			},
			{ name: "Obsidian", url: "https://obsidian.md" },
		],
		note: "Tried a full migration to Obsidian. Notes is just too convenient.",
	},
	{
		emoji: "✅",
		category: "to-do",
		apps: [{ name: "Todoist", url: "https://todoist.com" }],
	},
	{
		emoji: "📅",
		category: "calendar",
		apps: [
			{
				name: "Apple Calendar",
				url: "https://support.apple.com/guide/calendar/welcome/mac",
			},
		],
	},
	{
		emoji: "👥",
		category: "contacts",
		apps: [
			{
				name: "Apple Contacts",
				url: "https://support.apple.com/guide/contacts/welcome/mac",
			},
		],
	},
	{
		emoji: "🛒",
		category: "shopping lists",
		apps: [
			{
				name: "Apple Reminders",
				url: "https://support.apple.com/guide/reminders/welcome/mac",
			},
		],
	},
	{
		emoji: "🔖",
		category: "bookmarks",
		apps: [{ name: "Raindrop.io", url: "https://raindrop.io" }],
	},
	{
		emoji: "📚",
		category: "read later",
		apps: [{ name: "Readeck", url: "https://www.readeck.com" }],
		note: "Self-hosted.",
	},
	{
		emoji: "📡",
		category: "rss reader",
		apps: [{ name: "FreshRSS", url: "https://freshrss.org" }],
	},
	{
		emoji: "💬",
		category: "chat",
		apps: [
			{ name: "Signal", url: "https://signal.org" },
			{ name: "iMessage", url: "https://www.apple.com/imessage/" },
			{ name: "WhatsApp", url: "https://www.whatsapp.com" },
		],
		note: "Would love to drop WhatsApp, but 99% of contacts live there.",
	},
	{
		emoji: "🎵",
		category: "music",
		apps: [{ name: "Spotify", url: "https://www.spotify.com" }],
	},
	{
		emoji: "🎧",
		category: "podcasts",
		apps: [
			{ name: "Apple Podcasts", url: "https://www.apple.com/apple-podcasts/" },
		],
	},
	{
		emoji: "☁️",
		category: "cloud storage",
		apps: [
			{ name: "iCloud", url: "https://www.icloud.com" },
			{ name: "Dropbox", url: "https://www.dropbox.com" },
			{ name: "Mega", url: "https://mega.io" },
		],
		note: "iCloud for the important stuff, Dropbox for legacy, Mega for overflow.",
	},
	{
		emoji: "📷",
		category: "photo library",
		apps: [{ name: "iCloud Photos", url: "https://www.icloud.com" }],
	},
	{
		emoji: "🖥️",
		category: "web hosting",
		apps: [{ name: "Uberspace", url: "https://uberspace.de" }],
	},
] satisfies UsesItem[];
