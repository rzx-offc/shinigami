from bs4 import BeautifulSoup
import re

for filename in ["explore.html", "search.html"]:
    print("\n" + "="*60)
    print("FILE:", filename)

    html = open(filename, encoding="utf-8").read()
    soup = BeautifulSoup(html, "lxml")

    print("\n=== BODY TEXT ===")
    body = soup.body
    if body:
        print(body.get_text(" ", strip=True)[:7000])

    print("\n=== ELEMENTS WITH DATA ATTRIBUTES ===")
    for tag in soup.find_all(True):
        attrs = {
            k: v for k, v in tag.attrs.items()
            if k.startswith("data-") or k in ["id", "class"]
        }
        if attrs and tag.name not in ["html", "body"]:
            print(tag.name, attrs, tag.get_text(" ", strip=True)[:150])

    print("\n=== INPUTS / BUTTONS ===")
    for tag in soup.select("input,button,select,textarea"):
        print(tag.name, tag.attrs, tag.get_text(" ", strip=True))

    print("\n=== INLINE SCRIPTS ===")
    for i, script in enumerate(soup.find_all("script")):
        if script.get("src"):
            continue
        content = script.string or script.get_text()
        if content.strip():
            print(f"\nSCRIPT {i}:")
            print(content[:5000])

    print("\n=== POSSIBLE API REFERENCES ===")
    patterns = [
        r'https?://[^"\']+',
        r'/api/[^"\']+',
        r'fetch\([^)]{1,500}\)',
        r'axios\.[a-z]+\([^)]{1,500}\)',
        r'graphql',
        r'__NEXT_DATA__',
        r'pagination',
        r'pageSize',
    ]

    for pattern in patterns:
        matches = re.findall(pattern, html, re.I)
        for match in matches[:20]:
            print(match)
