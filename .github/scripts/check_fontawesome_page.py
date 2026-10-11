#!/usr/bin/env python3
"""Check that Font Awesome's icon detail page still exposes required elements."""

import re
import sys

from playwright.sync_api import TimeoutError as PlaywrightTimeoutError
from playwright.sync_api import sync_playwright


TARGET_URL = "https://fontawesome.com/icons/classic/regular/registered"
TARGET_URL_REGEX = re.compile(
    r"^https?://fontawesome\.com/(?:v\d+/)?icons(?:/[\w-]+){3}/?"
)
COPY_BUTTON_SELECTOR = ".copy-button"
ICON_CLASS_NAME_SELECTOR = "span.token.attr-value, span.token.script.language-javascript"
ELEMENT_TIMEOUT_MS = 30_000


def main() -> int:
    if not TARGET_URL_REGEX.match(TARGET_URL):
        print(f"Configured URL does not match the background script pattern: {TARGET_URL}")
        return 1

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch()
        page = browser.new_page()
        try:
            response = page.goto(
                TARGET_URL,
                wait_until="domcontentloaded",
                timeout=ELEMENT_TIMEOUT_MS,
            )
            if response is not None and response.status >= 400:
                raise RuntimeError(f"Font Awesome returned HTTP {response.status}")

            page.wait_for_function(
                """({copyButtonSelector, classNameSelector}) =>
                    document.querySelectorAll(copyButtonSelector).length > 0 &&
                    document.querySelectorAll(classNameSelector).length > 0""",
                arg={
                    "copyButtonSelector": COPY_BUTTON_SELECTOR,
                    "classNameSelector": ICON_CLASS_NAME_SELECTOR,
                },
                timeout=ELEMENT_TIMEOUT_MS,
            )

            copy_button_count = page.locator(COPY_BUTTON_SELECTOR).count()
            class_name_element_count = page.locator(ICON_CLASS_NAME_SELECTOR).count()
            print(
                f"OK: {TARGET_URL}\n"
                f"Found {copy_button_count} copy button(s) and "
                f"{class_name_element_count} icon class-name element(s)."
            )
            return 0
        except (PlaywrightTimeoutError, RuntimeError) as error:
            print(f"Font Awesome page check failed: {error}", file=sys.stderr)
            print(f"Page title: {page.title()}", file=sys.stderr)
            print(f"Final URL: {page.url}", file=sys.stderr)
            print(
                f"Selector counts: {COPY_BUTTON_SELECTOR}="
                f"{page.locator(COPY_BUTTON_SELECTOR).count()}, "
                f"{ICON_CLASS_NAME_SELECTOR}="
                f"{page.locator(ICON_CLASS_NAME_SELECTOR).count()}",
                file=sys.stderr,
            )
            return 1
        finally:
            browser.close()


if __name__ == "__main__":
    raise SystemExit(main())
