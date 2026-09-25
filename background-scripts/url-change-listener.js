// SPDX-License-Identifier: ISC
// Copyright (c) 2026, mtueih

// 匹配目标 URL 的正则表达式。
const TARGET_URL_REGEX =
  /^https?:\/\/fontawesome\.com\/(?:v\d+\/)?icons(?:\/[\w-]+){3}\/?/;

// 监听 URL 变化。
browser.webNavigation.onHistoryStateUpdated.addListener(
  async (details) => {
    // const currentUrl = details.url;
    const currentTabId = details.tabId;

    // console.log("【后台脚本】：URL 变化：", currentUrl);

    browser.tabs.sendMessage(currentTabId, {
      type: "goToTargetUrl",
    });
  },
  { url: [{ urlMatches: TARGET_URL_REGEX.source }] },
);
