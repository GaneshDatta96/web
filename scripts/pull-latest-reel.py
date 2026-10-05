#!/usr/bin/env python3
"""Replace media/latest-reel.mp4 when @theganeshdatta posts a newer reel.

The homepage plays that file. Instagram blocks a browser on ganeshdatta.me
from reading the feed, so this script runs on a schedule, opens the public
reels page, and saves the newest clip.
"""

import base64
import json
import re
import sys
import urllib.request
from pathlib import Path
from urllib.parse import parse_qs, urlparse

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
MEDIA = ROOT / "media"
MP4 = MEDIA / "latest-reel.mp4"
META = MEDIA / "latest-reel.json"
USERNAME = "theganeshdatta"
REELS = "https://www.instagram.com/%s/reels/" % USERNAME
UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
)


def current_shortcode():
    if not META.exists():
        return None
    try:
        return json.loads(META.read_text(encoding="utf-8")).get("shortcode")
    except (OSError, json.JSONDecodeError):
        return None


def shortcodes(page):
    page.goto(REELS, wait_until="domcontentloaded", timeout=45000)
    page.wait_for_selector('a[href*="/reel/"]', timeout=20000)
    hrefs = page.eval_on_selector_all(
        'a[href*="/reel/"]',
        "els => els.map(el => el.getAttribute('href') || '')",
    )
    ordered = []
    for href in hrefs:
        match = re.search(r"/reel/([A-Za-z0-9_-]+)", href)
        if match and match.group(1) not in ordered:
            ordered.append(match.group(1))
    return ordered[:4]


def video_src(page, shortcode):
    page.goto(
        "https://www.instagram.com/reel/%s/embed/" % shortcode,
        wait_until="domcontentloaded",
        timeout=45000,
    )
    page.wait_for_function(
        """() => {
          const video = document.querySelector('video');
          return video && video.currentSrc && video.currentSrc.indexOf('.mp4') > -1;
        }""",
        timeout=20000,
    )
    return page.eval_on_selector("video", "video => video.currentSrc")


def age_days(url):
    efg = (parse_qs(urlparse(url).query).get("efg") or [""])[0]
    if not efg:
        return 10**9
    pad = "=" * (-len(efg) % 4)
    try:
        payload = json.loads(base64.b64decode(efg + pad))
    except (ValueError, json.JSONDecodeError):
        return 10**9
    age = payload.get("asset_age_days")
    return age if isinstance(age, int) else 10**9


def download(url):
    request = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(request, timeout=90) as response:
        data = response.read()
    if len(data) < 50_000 or b"ftyp" not in data[:64]:
        raise RuntimeError("download was not a video (%s bytes)" % len(data))
    MP4.write_bytes(data)


def newest(page):
    codes = shortcodes(page)
    if not codes:
        raise RuntimeError("no reels on the public feed")
    best = None
    for code in codes:
        src = video_src(page, code)
        age = age_days(src)
        if best is None or age < best[0]:
            best = (age, code, src)
    return best[1], best[2]


def main():
    MEDIA.mkdir(exist_ok=True)
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page(user_agent=UA)
        shortcode, src = newest(page)
        browser.close()
    if shortcode == current_shortcode() and MP4.exists():
        print("latest reel is already %s" % shortcode)
        return 0
    download(src)
    META.write_text(
        json.dumps(
            {
                "shortcode": shortcode,
                "permalink": "https://www.instagram.com/reel/%s/" % shortcode,
                "username": USERNAME,
            },
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    print("saved %s (%s bytes)" % (shortcode, MP4.stat().st_size))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as error:
        print(error, file=sys.stderr)
        raise SystemExit(1)
