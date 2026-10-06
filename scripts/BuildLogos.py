#!/usr/bin/env python3
"""Build the site's logo files from the stacked brand vector.

The stacked vector (Brand/LogoMaster.svg) is the one coloured
master. This splits it into the berry icon and the wordmark, then writes:

  src/assets/brand/LogoWide.svg       icon beside the wordmark, brand colours
  src/assets/brand/LogoWideDark.svg   the same, recoloured for dark backgrounds
  src/assets/brand/Icon.svg           berry only
  public/favicon.svg                  berry only

Run it again if the master changes:  python3 scripts/BuildLogos.py <master.svg>
"""

import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

NS = "{http://www.w3.org/2000/svg}"
PLUM = "#802a90"
LEAF = "#25b164"
# Dark backgrounds: the brand plum drops below 3:1 contrast on the dark page, so
# the dots lift to a lighter plum and the wordmark turns near-white.
DARK_DOTS = "#b76cc6"
DARK_WORDMARK = "#f5eef7"

# Bounding boxes measured from the master's coordinates.
ICON_X0, ICON_X1, ICON_H = 186.0, 620.0, 643.0
WORD_Y0, WORD_H, WORD_W = 717.36, 298.24, 805.27


def first_xy(el):
    """First coordinate pair of a path or polygon: enough to tell parts apart."""
    data = el.get("d") or el.get("points")
    nums = re.findall(r"-?\d+(?:\.\d+)?", data)
    return float(nums[0]), float(nums[1])


def markup(el, fill):
    tag = el.tag.replace(NS, "")
    attr = "d" if tag == "path" else "points"
    return f'<{tag} fill="{fill}" {attr}="{el.get(attr)}"/>'


def main(master):
    root = ET.parse(master).getroot()
    parts = {"dots": [], "leaves": [], "plum_word": [], "leaf_word": []}
    for el in root.iter():
        cls = el.get("class")
        if cls not in ("cls-1", "cls-2"):
            continue
        _, y = first_xy(el)
        is_word = y > 700
        if cls == "cls-1":
            parts["plum_word" if is_word else "dots"].append(el)
        else:
            parts["leaf_word" if is_word else "leaves"].append(el)

    def icon(dots_fill):
        return "".join(markup(e, LEAF) for e in parts["leaves"]) + "".join(
            markup(e, dots_fill) for e in parts["dots"]
        )

    def word(plum_fill):
        return "".join(markup(e, plum_fill) for e in parts["plum_word"]) + "".join(
            markup(e, LEAF) for e in parts["leaf_word"]
        )

    # Wide lockup, proportions taken from the brand's wide PNG: the wordmark spans
    # from 11% to 94% of the icon's height, with a gap of about a quarter icon width.
    icon_w = ICON_X1 - ICON_X0
    scale = (ICON_H * 0.83) / WORD_H
    gap = icon_w * 0.235
    word_x = icon_w + gap
    word_y = ICON_H * 0.11 - WORD_Y0 * scale
    total_w = round(word_x + WORD_W * scale, 1)

    def wide(dots_fill, plum_fill, title):
        return (
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {total_w} {ICON_H}" '
            f'role="img" aria-labelledby="t"><title id="t">{title}</title>'
            f'<g transform="translate({-ICON_X0} 0)">{icon(dots_fill)}</g>'
            f'<g transform="translate({word_x:.1f} {word_y:.1f}) scale({scale:.4f})">'
            f"{word(plum_fill)}</g></svg>\n"
        )

    icon_svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{ICON_X0 - 4} -4 '
        f'{icon_w + 8} {ICON_H + 8}" role="img" aria-labelledby="t">'
        f'<title id="t">Plum Solutions</title>{icon(PLUM)}</svg>\n'
    )

    out = Path(__file__).resolve().parent.parent
    brand = out / "src/assets/brand"
    brand.mkdir(parents=True, exist_ok=True)
    (brand / "LogoWide.svg").write_text(wide(PLUM, PLUM, "Plum Solutions"))
    (brand / "LogoWideDark.svg").write_text(wide(DARK_DOTS, DARK_WORDMARK, "Plum Solutions"))
    (brand / "Icon.svg").write_text(icon_svg)
    (out / "public/favicon.svg").write_text(icon_svg)
    print(f"dots={len(parts['dots'])} leaves={len(parts['leaves'])} "
          f"plum_word={len(parts['plum_word'])} leaf_word={len(parts['leaf_word'])} "
          f"wide={total_w}x{ICON_H}")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "Brand/LogoMaster.svg")
