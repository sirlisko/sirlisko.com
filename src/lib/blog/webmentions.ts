import { WEBMENTION_ENDPOINT } from "../../config";

export interface Mention {
	author: { name: string; photo?: string; url?: string };
	url: string;
	published?: string;
	text?: string;
}

export interface Mentions {
	likes: Mention[];
	reposts: Mention[];
	replies: Mention[];
}

interface Entry {
	author?: { name?: string; photo?: string; url?: string };
	url?: string;
	published?: string | null;
	"wm-received"?: string;
	"wm-property"?: string;
	content?: { text?: string };
}

const API = new URL("/api/mentions.jf2", WEBMENTION_ENDPOINT).href;

export const mentionsUrl = (target: string): string =>
	`${API}?per-page=200&sort-dir=up&target=${encodeURIComponent(target)}`;

const MAX_TEXT = 280;

const toMention = (entry: Entry): Mention | null => {
	if (!entry.url) {
		return null;
	}
	const text = entry.content?.text?.trim();
	return {
		author: {
			name: entry.author?.name || new URL(entry.url).hostname,
			...(entry.author?.photo && { photo: entry.author.photo }),
			...(entry.author?.url && { url: entry.author.url }),
		},
		url: entry.url,
		...((entry.published || entry["wm-received"]) && {
			published: entry.published || entry["wm-received"],
		}),
		...(text && {
			text: text.length > MAX_TEXT ? `${text.slice(0, MAX_TEXT)}…` : text,
		}),
	};
};

/** Sorts webmention.io's feed into a facepile of likes and reposts, and the replies to read. */
export const groupMentions = (children: Entry[]): Mentions => {
	const mentions: Mentions = { likes: [], reposts: [], replies: [] };
	for (const entry of children) {
		const mention = toMention(entry);
		if (!mention) {
			continue;
		}
		switch (entry["wm-property"]) {
			case "like-of":
				mentions.likes.push(mention);
				break;
			case "repost-of":
				mentions.reposts.push(mention);
				break;
			case "in-reply-to":
			case "mention-of":
				if (mention.text) {
					mentions.replies.push(mention);
				}
				break;
		}
	}
	return mentions;
};
