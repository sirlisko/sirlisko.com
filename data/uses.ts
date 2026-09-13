export interface UsesApp {
	name: string;
	url?: string;
}

export interface UsesItem {
	emoji: string;
	category: string;
	apps: UsesApp[];
	note?: string;
}

export const USES_SOURCE = "https://sirlisko.com/blog/my-default-apps-2024";
export const USES_SOURCE_LABEL = "the original post";
export const USES_LAST_UPDATED = "September 2026";
export const DOTFILES_SOURCE = "https://github.com/sirlisko/dotfiles";
export const DOTFILES_SOURCE_LABEL = "dotfiles repo";

export const hardware = [
	{
		emoji: "💻",
		category: "laptop",
		apps: [
			{
				name: "MacBook Pro M1 Pro (32GB RAM)",
				url: "https://www.apple.com/macbook-pro/",
			},
		],
	},
	{
		emoji: "🖥️",
		category: "monitor",
		apps: [
			{
				name: 'LG 23.7" UltraFine™ 4K Monitor',
				url: "https://www.lg.com/us/business/computer-monitors/lg-24md4klb-b",
			},
		],
	},
	{
		emoji: "📱",
		category: "phone",
		apps: [{ name: "iPhone 17", url: "https://www.apple.com/iphone-17/" }],
	},
	{
		emoji: "⌚",
		category: "watch",
		apps: [
			{
				name: "Apple Watch SE 3",
				url: "https://www.apple.com/apple-watch-se/",
			},
		],
	},
	{
		emoji: "🎧",
		category: "headphones",
		apps: [
			{
				name: "Sony WH-1000XM3",
				url: "https://www.sony.com/electronics/headband-headphones/wh-1000xm3",
			},
		],
	},
	{
		emoji: "🎧",
		category: "earbuds",
		apps: [
			{ name: "AirPods Pro 2", url: "https://www.apple.com/airpods-pro/" },
		],
	},
	{
		emoji: "📖",
		category: "e-reader",
		apps: [
			{
				name: "Kindle Paperwhite (2013)",
				url: "https://en.wikipedia.org/wiki/Amazon_Kindle",
			},
		],
		note: "Jailbroken. With KOReader.",
	},
	{
		emoji: "📱",
		category: "tablet",
		apps: [{ name: "iPad (A16)", url: "https://www.apple.com/ipad/" }],
	},
	{
		emoji: "🪑",
		category: "chair",
		apps: [
			{
				name: "Varier Variable™ Kneeling Chair",
				url: "https://varierchairs.com/kneeling-chairs/variable-balans/",
			},
		],
	},
] satisfies UsesItem[];

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
		note: "Quick answers alone are worth it.",
	},
	{
		emoji: "💻",
		category: "code editor",
		apps: [{ name: "VSCode", url: "https://code.visualstudio.com" }],
	},
	{
		emoji: "⌨️",
		category: "terminal",
		apps: [{ name: "iTerm2", url: "https://iterm2.com" }],
		note: "Snazzy theme, Fira Code Nerd Font.",
	},
	{
		emoji: "🌿",
		category: "git client",
		apps: [
			{ name: "lazygit", url: "https://github.com/jesseduffield/lazygit" },
		],
	},
	{
		emoji: "🚀",
		category: "launcher",
		apps: [
			{
				name: "Raycast",
				url: "https://www.raycast.com",
			},
		],
		note: "Also handles window management and clipboard history.",
	},
	{
		emoji: "🔐",
		category: "password manager",
		apps: [{ name: "1Password", url: "https://1password.com" }],
		note: "Mostly for the developer tools.",
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
		apps: [
			{ name: "Private VPS" },
			{ name: "Netlify", url: "https://www.netlify.com" },
		],
		note: "Self-hosted on a private VPS, static sites on Netlify.",
	},
] satisfies UsesItem[];

export const cli = [
	{
		emoji: "🐚",
		category: "shell",
		apps: [{ name: "oh-my-zsh", url: "https://ohmyz.sh" }],
		note: "ZSH and a bunch of plugins, out of the box.",
	},
	{
		emoji: "✨",
		category: "shell prompt",
		apps: [{ name: "Starship", url: "https://starship.rs" }],
		note: "I feel lost without my custom prompt.",
	},
	{
		emoji: "🧭",
		category: "navigation",
		apps: [
			{ name: "zoxide", url: "https://github.com/ajeetdsouza/zoxide" },
			{ name: "fzf", url: "https://github.com/junegunn/fzf" },
		],
		note: "cd and Ctrl+R, but smarter.",
	},
	{
		emoji: "🦾",
		category: "modern unix",
		apps: [
			{ name: "ripgrep", url: "https://github.com/BurntSushi/ripgrep" },
			{ name: "fd", url: "https://github.com/sharkdp/fd" },
			{ name: "bat", url: "https://github.com/sharkdp/bat" },
			{ name: "eza", url: "https://github.com/eza-community/eza" },
		],
		note: "grep, find, cat, and ls — faster and friendlier.",
	},
	{
		emoji: "🔀",
		category: "diff pager",
		apps: [{ name: "git-delta", url: "https://github.com/dandavison/delta" }],
		note: "Syntax-highlighted git diffs.",
	},
	{
		emoji: "🐙",
		category: "GitHub CLI",
		apps: [{ name: "gh", url: "https://cli.github.com" }],
		note: "PRs and issues without leaving the terminal.",
	},
	{
		emoji: "🔤",
		category: "font",
		apps: [
			{
				name: "FiraCode Nerd Font Mono",
				url: "https://www.nerdfonts.com/font-downloads",
			},
		],
		note: "Ligatures and icons, everywhere in the terminal.",
	},
] satisfies UsesItem[];
