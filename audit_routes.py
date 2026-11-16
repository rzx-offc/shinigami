
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import json
import time

BASE = "https://11.shinigami.asia"

session = requests.Session()
session.headers.update({
    "User-Agent": "Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 Chrome/130.0.0.0 Mobile Safari/537.36"
})

routes = ["/explore", "/search"]

for route in routes:
    url = urljoin(BASE, route)

    print("\n" + "=" * 55)
    print("HALAMAN:", url)

    try:
        response = session.get(url, timeout=30)
        print("STATUS:", response.status_code)
        print("SIZE:", len(response.content))

        if response.status_code != 200:
            continue

        soup = BeautifulSoup(response.text, "lxml")

        print("TITLE:", soup.title.get_text(strip=True) if soup.title else "-")

        print("\n--- FORM ---")
        for form in soup.select("form"):
            print({
                "action": form.get("action"),
                "method": form.get("method"),
                "inputs": [
                    {
                        "name": x.get("name"),
                        "type": x.get("type"),
                        "value": x.get("value")
                    }
                    for x in form.select("input,select,button")
                ]
            })

        print("\n--- LINKS ---")
        links = []

        for a in soup.select("a[href]"):
            item = {
                "text": a.get_text(" ", strip=True),
                "href": urljoin(BASE, a["href"])
            }
            links.append(item)
            print(item)

        print("\n--- IMAGES ---")
        for img in soup.select("img"):
            print({
                "alt": img.get("alt"),
                "src": img.get("src"),
                "data_src": img.get("data-src")
            })

        print("\n--- SCRIPTS ---")
        for script in soup.select("script[src]"):
            print(script.get("src"))

        filename = route.strip("/").replace("/", "_") + ".html"
        with open(filename, "w", encoding="utf-8") as f:
            f.write(response.text)

        with open(filename.replace(".html", ".json"), "w", encoding="utf-8") as f:
            json.dump(links, f, ensure_ascii=False, indent=2)

        print("\nTERSIMPAN:", filename)

    except Exception as e:
        print("ERROR:", repr(e))

    time.sleep(2)

print("\nAUDIT SELESAI")
