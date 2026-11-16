
import os
import re
import requests
from urllib.parse import urljoin

BASE = "https://11.shinigami.asia/"
ASSET_BASE = urljoin(BASE, "_app/immutable/")

session = requests.Session()
session.headers.update({
    "User-Agent": "Mozilla/5.0"
})

os.makedirs("modules/nodes", exist_ok=True)
os.makedirs("modules/chunks", exist_ok=True)

# Manifest yang sudah berhasil diunduh
manifest_path = "js_files/app.sGxwMBxG.js"

if not os.path.exists(manifest_path):
    raise SystemExit("File manifest tidak ditemukan: " + manifest_path)

with open(manifest_path, encoding="utf-8") as f:
    manifest = f.read()

# Ambil semua referensi modul nodes dan chunks
paths = re.findall(
    r"""["']((?:\.\./)(?:nodes|chunks)/[^"']+\.js)["']""",
    manifest
)

paths = sorted(set(paths))

print("Modul ditemukan:", len(paths))

for path in paths:
    url = urljoin(ASSET_BASE + "entry/", path)

    try:
        response = session.get(url, timeout=25)
        print(response.status_code, len(response.content), url)

        if response.status_code != 200:
            continue

        folder = "nodes" if "/nodes/" in path else "chunks"
        filename = path.split("/")[-1]
        output = os.path.join("modules", folder, filename)

        with open(output, "w", encoding="utf-8") as f:
            f.write(response.text)

    except requests.RequestException as e:
        print("ERROR:", url, e)

print("\nSelesai mengunduh modul yang tersedia.")

