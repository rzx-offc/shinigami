import requests
from bs4 import BeautifulSoup
import json

BASE = "https://11.shinigami.asia/"

headers = {
    "User-Agent": "Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 Chrome/130.0.0.0 Mobile Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
}

print("Mengakses:", BASE)

try:
    r = requests.get(BASE, headers=headers, timeout=30)

    print("HTTP STATUS:", r.status_code)
    print("FINAL URL:", r.url)
    print("CONTENT TYPE:", r.headers.get("Content-Type"))
    print("UKURAN:", len(r.content), "bytes")

    with open("homepage.html", "w", encoding="utf-8") as f:
        f.write(r.text)

    soup = BeautifulSoup(r.text, "lxml")

    print("\n=== TITLE ===")
    print(soup.title.get_text(strip=True) if soup.title else "Tidak ditemukan")

    print("\n=== LINK ===")

    links = []

    for a in soup.select("a[href]"):
        item = {
            "text": a.get_text(" ", strip=True),
            "href": a.get("href")
        }

        links.append(item)

    for item in links[:100]:
        print(item)

    with open("links.json", "w", encoding="utf-8") as f:
        json.dump(links, f, indent=2, ensure_ascii=False)

    print("\nAudit selesai.")
    print("File: homepage.html dan links.json")

except Exception as e:
    print("ERROR:", repr(e))
