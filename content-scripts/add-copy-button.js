// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.


// 扩展的 UUID。
const EXTENSION_UUID = browser.i18n.getMessage("@@extension_id");
// 原网站中「图标 URL 复制按钮」的选择器。
// （「图标类名复制按钮」将会插入到其后。）
const URL_CPY_BTN_SELECTORS = [
	"button[aria-label=\"Copy Icon URL\"]"
];
// 包含「图标类名」的元素的选择器。
const ICON_CLASS_NAME_EL_SELECTORS = [
	"span.token.attr-value",
	"span.token.script.language-javascript"
];
// 从「包含类名元素」中提取类名的正则表达式。
const ICON_CLASS_NAME_REGEX = /=["{](.+)["}]/;
// 指定类名是第几个捕获组。
const ICON_CLASS_NAME_REGEX_GROUP = 1;
// 「图标类名复制按钮」的唯一 ID，用于防止重复插入。
// （使用「扩展的 UUID」以防止冲突。）
const UNIQUE_CPY_BTN_ID = `cpy-btn-Extension-${EXTENSION_UUID}`;
// 「用于美化「图标类名复制按钮」样式的一系列 CSS」的 style 标签的唯一 ID。
// （用于防止重复插入。）
// （使用「扩展的 UUID」以防止冲突。）
const UNIQUE_CPY_BTN_STYLE_ID = `cpy-btn-style-Extension-${EXTENSION_UUID}`;
// 唯一按钮状态类名，防止冲突。
// 悬停状态类名，用于维持悬浮气泡。
const UNIQUE_CPY_BTN_HOVER_CLASS = `hover-Extension-${EXTENSION_UUID}`;
// 复制成功时类名，用于差异化按钮样式。
const UNIQUE_CPY_BTN_SUCCESS_CLASS = `copy-success-Extension-${EXTENSION_UUID}`;
// 复制失败时类名，用于差异化按钮样式。
const UNIQUE_CPY_BTN_FAIL_CLASS = `copy-fail-Extension-${EXTENSION_UUID}`;
// 按钮状态改变的持续时间。
const CPY_BTN_STATUS_DURATION = 1000;

// 「图标类名复制按钮」的 SVG 图标的 Path。
const CPY_BTN_SVG_PATH = "M288 64C252.7 64 224 92.7 224 128L224 384C224 419.3 252.7 448 288 448L480 448C515.3 448 544 419.3 544 384L544 183.4C544 166 536.9 149.3 524.3 137.2L466.6 81.8C454.7 70.4 438.8 64 422.3 64L288 64zM160 192C124.7 192 96 220.7 96 256L96 512C96 547.3 124.7 576 160 576L352 576C387.3 576 416 547.3 416 512L416 496L352 496L352 512L160 512L160 256L176 256L176 192L160 192z";

// 用于指定按钮的悬浮气泡显示文字的属性名。
const CPY_BTN_TOOLTIP_PROPERTY_NAME = "data-tooltip";
// 国际化：按钮悬浮气泡显示文本。
const CPY_BTN_TOOLTIP_TEXT = browser.i18n.getMessage("cpyBtnTooltipText");
const CPY_BTN_TOOLTIP_TEXT_COPY_SUCCESS = browser.i18n.getMessage("cpyBtnTooltipTextCopySuccess");
const CPY_BTN_TOOLTIP_TEXT_COPY_FAIL = browser.i18n.getMessage("cpyBtnTooltipTextCopyFail");


// 用于用于美化「图标类名复制按钮」样式的一系列 CSS 变量。
// 按钮颜色。
const CPY_BTN_CSS_BTN_COLOR = "#4682B4";
// 按钮悬停时的颜色。
const CPY_BTN_CSS_BTN_COLOR_HOVER = "#2F4F4F";
// 按钮悬停时悬浮气泡的文字颜色。
const CPY_BTN_CSS_BTN_TOOLTIP_COLOR = "#FFFFF0";
// 当复制成功时，按钮悬停悬浮气泡文字颜色。
const CPY_BTN_CSS_BTN_TOOLTIP_COLOR_COPY_SUCCESS = "#7CFC00";
// 当复制成功时，按钮悬停悬浮气泡文字颜色。
const CPY_BTN_CSS_BTN_TOOLTIP_COLOR_COPY_FIAL = "#FFA500";


// 用于美化「图标类名复制按钮」样式的一系列 CSS 的字符串。
const CPY_BTN_CSS = `
	#${UNIQUE_CPY_BTN_ID} {
		all: initial;
		cursor: pointer;
		width: 1.6em;
		color: ${CPY_BTN_CSS_BTN_COLOR};
		position: relative;
		transition: transform 0.2s ease;
	}

	#${UNIQUE_CPY_BTN_ID}:hover {
		color: ${CPY_BTN_CSS_BTN_COLOR_HOVER};
	}

	#${UNIQUE_CPY_BTN_ID}:active {
		transform: translateY(4%);
	}

	#${UNIQUE_CPY_BTN_ID}::after,
	#${UNIQUE_CPY_BTN_ID}::before {
		position: absolute;
		bottom: 100%;
		left: 50%;
		transform: translateX(-50%);
		opacity: 0;
		visibility: hidden;
		transition: opacity 0.4s ease;
		z-index: 1000;
		font-size: 0.8em;
	}

	#${UNIQUE_CPY_BTN_ID}::after {
		content: attr(data-tooltip);
		white-space: nowrap;
		padding: 0.8em;
		margin-bottom: 0.7em;
		background-color: ${CPY_BTN_CSS_BTN_COLOR};
		color: ${CPY_BTN_CSS_BTN_TOOLTIP_COLOR};
	}
	
	#${UNIQUE_CPY_BTN_ID}::before {
		content: "";
		border: 0.4em solid transparent;
		border-top-color: ${CPY_BTN_CSS_BTN_COLOR};
	}
	
	#${UNIQUE_CPY_BTN_ID}:hover::after,
	#${UNIQUE_CPY_BTN_ID}:hover::before,
	#${UNIQUE_CPY_BTN_ID}.${UNIQUE_CPY_BTN_HOVER_CLASS}::after,
	#${UNIQUE_CPY_BTN_ID}.${UNIQUE_CPY_BTN_HOVER_CLASS}::before {
		opacity: 1;
		visibility: visible;
	}

	#${UNIQUE_CPY_BTN_ID}.${UNIQUE_CPY_BTN_SUCCESS_CLASS}::after {
		color: ${CPY_BTN_CSS_BTN_TOOLTIP_COLOR_COPY_SUCCESS};
	}

	#${UNIQUE_CPY_BTN_ID}.${UNIQUE_CPY_BTN_FAIL_CLASS}::after {
		color: ${CPY_BTN_CSS_BTN_TOOLTIP_COLOR_COPY_FIAL};
	}
`;


// 用于临时切换按钮状态的计时器。
let CpyBtnStatusTimer;

// console.log("【内容脚本】：已被注入！");


// 等待元素加载完成。
function waitForElement(selector) {
	return new Promise((resolve) => {
		// 如果元素已经存在，直接返回
		const el = document.querySelector(selector);
		if (el) return resolve(el);

		const observer = new MutationObserver(() => {
			const el = document.querySelector(selector);
			if (el) {
				observer.disconnect();
				resolve(el);
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	});
}

// 临时切换按钮状态（复制成功/失败），一定延迟后复原。
function cpyBtnChangeStatus(isSuccess) {
	const cpyBtn = document.getElementById(UNIQUE_CPY_BTN_ID);
	// 修该悬浮气泡文本。
	cpyBtn.setAttribute(CPY_BTN_TOOLTIP_PROPERTY_NAME,
		isSuccess
			? CPY_BTN_TOOLTIP_TEXT_COPY_SUCCESS
			: CPY_BTN_TOOLTIP_TEXT_COPY_FAIL
	);

	// 添加 Hover 状态以维持悬浮气泡不消失。
	cpyBtn.classList.add(UNIQUE_CPY_BTN_HOVER_CLASS);
	// 添加复制（成功/失败）状态类。
	cpyBtn.classList.add(isSuccess
		? UNIQUE_CPY_BTN_SUCCESS_CLASS
		: UNIQUE_CPY_BTN_FAIL_CLASS
	);


	// 设置定时器，以在延迟后复原。
	clearTimeout(CpyBtnStatusTimer);
	CpyBtnStatusTimer = setTimeout(() => {
		cpyBtn.setAttribute(CPY_BTN_TOOLTIP_PROPERTY_NAME, CPY_BTN_TOOLTIP_TEXT);
		cpyBtn.classList.remove(UNIQUE_CPY_BTN_HOVER_CLASS);
		cpyBtn.classList.remove(isSuccess
			? UNIQUE_CPY_BTN_SUCCESS_CLASS
			: UNIQUE_CPY_BTN_FAIL_CLASS
		);
	}, CPY_BTN_STATUS_DURATION);
}

// 按钮点击事件处理：复制类名。
// 传入按钮对象，以在复制成功或失败后，对按钮做出修改以反映复制的结果。
function copyIconClassName() {
	// 查询包含类名的元素。
	const iconClassNameEl = document.querySelector(ICON_CLASS_NAME_EL_SELECTORS.join(","));
	if (!iconClassNameEl) {
		// console.log("【内容脚本】：错误：未找到包含类名的元素。");
		cpyBtnChangeStatus(false);
		return;
	}

	// 提取类名。
	const iconClassNameMatches = iconClassNameEl.innerText.match(ICON_CLASS_NAME_REGEX);
	if (!iconClassNameMatches) {
		// console.log("【内容脚本】：未提取到类名。");
		cpyBtnChangeStatus(false);
		return;
	}

	// 写入剪切板。
	navigator.clipboard.writeText(iconClassNameMatches[ICON_CLASS_NAME_REGEX_GROUP])
		.then(() => {
			// console.log("【内容脚本】：成功写入剪切板！");
			// console.log("【内容脚本】：复制成功，类名：", iconClassNameMatches[ICON_CLASS_NAME_REGEX_GROUP]);
			cpyBtnChangeStatus(true);
			return;
		})
		.catch((err) => {
			// console.log(`【内容脚本】：写入剪切板失败：${err}`);
			cpyBtnChangeStatus(false);
			return;
		});
}

// 注入 CSS。
function insertCpyBtnCss() {
	// 检查是否已插入，防止重复插入。
	if (document.getElementById(UNIQUE_CPY_BTN_STYLE_ID)) {
		// console.log("【内容脚本】：CSS 重复插入！");
		return;
	}

	// 应用 CSS。
	const styleElement = document.createElement("style");
	styleElement.id = UNIQUE_CPY_BTN_STYLE_ID;

	styleElement.textContent = CPY_BTN_CSS;

	// 注入 CSS。
	document.head.appendChild(styleElement);
}

// 设置按钮内容。
function setCopyButton(cpyBtn) {
	// 创建 SVG。
	// <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M288 64C252.7 64 224 92.7 224 128L224 384C224 419.3 252.7 448 288 448L480 448C515.3 448 544 419.3 544 384L544 183.4C544 166 536.9 149.3 524.3 137.2L466.6 81.8C454.7 70.4 438.8 64 422.3 64L288 64zM160 192C124.7 192 96 220.7 96 256L96 512C96 547.3 124.7 576 160 576L352 576C387.3 576 416 547.3 416 512L416 496L352 496L352 512L160 512L160 256L176 256L176 192L160 192z"/></svg>
	const btnSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	btnSvg.setAttribute("viewBox", "0 0 640 640");

	const btnSvgPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
	btnSvgPath.setAttribute("fill", "currentColor");
	btnSvgPath.setAttribute("d", CPY_BTN_SVG_PATH);

	btnSvg.appendChild(btnSvgPath);

	// 将 SVG 插入按钮子元素。
	cpyBtn.appendChild(btnSvg);
}


// 插入按钮。
function insertCopyButton(urlCpyBtn) {
	const container = urlCpyBtn.parentElement;
	if (!container) {
		// console.error("【内容脚本】：不可预测的错误：「URL 复制按钮」的父元素为空！");
		return;
	}


	// 检查是否已插入，防止重复插入。
	if (document.getElementById(UNIQUE_CPY_BTN_ID)) {
		// console.log("【内容脚本】：已插入「图标类名复制按钮」，重复插入？");
		return;
	}

	// 创建按钮元素。
	let cpyBtn = document.createElement("button");
	// 设置唯一 ID，防止重复插入。
	cpyBtn.id = UNIQUE_CPY_BTN_ID;

	// 设置按钮属性
	cpyBtn.setAttribute(CPY_BTN_TOOLTIP_PROPERTY_NAME, CPY_BTN_TOOLTIP_TEXT);

	// 设置按钮内容。
	setCopyButton(cpyBtn);

	// 添加点击事件处理函数。
	cpyBtn.addEventListener("click", copyIconClassName);

	// 插入按钮。
	container.appendChild(cpyBtn);

	// 注入 CSS。
	insertCpyBtnCss();
}

browser.runtime.onMessage.addListener((message) => {
	if (message?.type !== "goToTargetUrl") {
		return;
	}

	// console.log("【内容脚本】：收到来自「后台脚本」的消息。");

	waitForElement(URL_CPY_BTN_SELECTORS.join(","))
		.then((urlCpyBtn) => {
			// console.log("【内容脚本】：「图标 URL 复制按钮」加载完成！");
			insertCopyButton(urlCpyBtn);
		});
});