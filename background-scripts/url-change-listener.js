// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.


// 匹配目标 URL 的正则表达式。
const TARGET_URL_REGEX = /^https:\/\/fontawesome\.com\/icons\/[\w-]+\?f=[\w-]+&s=[\w-]+.*/;

// 监听 URL 变化。
browser.webNavigation.onHistoryStateUpdated.addListener(async (details) => {
	// const currentUrl = details.url;
	const currentTabId = details.tabId;

	// console.log("【后台脚本】：URL 变化：", currentUrl);

	browser.tabs.sendMessage(currentTabId, {
		type: "goToTargetUrl"
	});

}, { url: [{ urlMatches: TARGET_URL_REGEX.source }] });
