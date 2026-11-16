import requests
import re
import os

BASE = "https://11.shinigami.asia"
session = requests.Session()
session.headers["User-Agent"] = "Mozilla/5.0"

os.makedirs("js_files", exist_ok=True)

for page in ["explore.html", "search.html"]:
    html = open(page, encoding="utf-8").read()

    urls = re.findall(
        r'import\(["\']([^"\']+\.js)["\']\)',
        html
    )

    urls += re.findall(
        r'<script[^>]+src=["\']([^"\']+\.js)',
        html
    )

    for url in set(urls):
        full = requests.compat.urljoin(BASE + "/", url)

        try:
            r = session.get(full, timeout=30)
            print("\nFILE:", full)
            print("STATUS:", r.status_code, "SIZE:", len(r.content))

            if r.status_code != 200:
                continue

            name = url.split("/")[-1]
            path = "js_files/" + name

            open(path, "w", encoding="utf-8").write(r.text)

            patterns = [
                r'["\'](/api/[^"\']+)',
                r'["\']([^"\']*graphql[^"\']*)',
                r'fetch\([^)]{1,300}\)',
                r'axios\.[a-z]+\([^)]{1,300}\)',
                r'["\']([^"\']*series[^"\']*)',
                r'["\']([^"\']*chapter[^"\']*)',
            ]

            for pattern in patterns:
                for match in re.findall(pattern, r.text, re.I)[:30]:
                    print("MATCH:", match)

        except Exception as e:
            print("ERROR:", e)

print("\nSELESAI")
