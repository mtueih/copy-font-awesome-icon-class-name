// SPDX-License-Identifier: ISC
// Copyright (c) 2026, mtueih

// 匹配目标 URL 的正则表达式。
const TARGET_URL_REGEX =
  /^https?:\/\/fontawesome\.com\/(?:v\d+\/)?icons(?:\/[\w-]+){3}\/?/;

// 监听 URL 变化。
browser.webNavigation.onHistoryStateUpdated.addListener(
  (details) => {
    // console.log("【后台脚本】：URL 变化：", details.tabId);

    browser.tabs
      .sendMessage(details.tabId, {
        type: "goToTargetUrl",
      })
      .catch(() => {});
  },
  { url: [{ urlMatches: TARGET_URL_REGEX.source }] },
);
