const copyButtonLabel = "Copy";

async function copyCode(block: HTMLPreElement, button: HTMLButtonElement) {
	const text = block.querySelector("code")?.innerText;

	await navigator.clipboard.writeText(text ?? "");

	button.innerText = "Copied";

	setTimeout(() => {
		button.innerText = copyButtonLabel;
	}, 700);
}

// The relative wrapper also anchors the file name badge, which overhangs the
// block and would be clipped by the pre's own overflow
function attachCopyButton(codeBlock: HTMLPreElement) {
	const wrapper = document.createElement("div");
	wrapper.style.position = "relative";

	const copyButton = document.createElement("button");
	copyButton.className = "copy-code";
	copyButton.innerHTML = copyButtonLabel;
	codeBlock.setAttribute("tabindex", "0");
	codeBlock.appendChild(copyButton);

	codeBlock.parentNode?.insertBefore(wrapper, codeBlock);
	wrapper.appendChild(codeBlock);

	copyButton.addEventListener("click", async () => {
		await copyCode(codeBlock, copyButton);
	});
}

document.addEventListener("astro:page-load", () => {
	document
		.querySelectorAll<HTMLPreElement>("#article pre")
		.forEach(attachCopyButton);
});
