
import re
import os

targets = [
    "modules/nodes/18.DH7VzXH9.js",
    "modules/nodes/24.BHJRlH25.js",
    "modules/nodes/14.DSHoOBUY.js",
    "modules/nodes/17.BmgikkX1.js",
    "modules/nodes/25.BfPSI4O_.js",
]

keywords = [
    "api.shngm.io",
    "explore.shngm.io",
    "fetch(",
    "URLSearchParams",
    "page_size",
    "sort_by",
    "manga_id",
    "Authorization",
]

for path in targets:
    if not os.path.exists(path):
        print("FILE TIDAK ADA:", path)
        continue

    with open(path, encoding="utf-8", errors="ignore") as f:
        source = f.read()

    print("\n" + "=" * 65)
    print("FILE:", path)

    shown = set()

    for keyword in keywords:
        start = 0

        while True:
            pos = source.find(keyword, start)
            if pos == -1:
                break

            left = max(0, pos - 700)
            right = min(len(source), pos + 1100)

            snippet = source[left:right]

            if snippet not in shown:
                shown.add(snippet)
                print("\n---", keyword, "---")
                print(snippet)

            start = pos + len(keyword)

            if len(shown) >= 15:
                break

        if len(shown) >= 15:
            break

