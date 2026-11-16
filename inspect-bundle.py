
import re
import os

folder = "js_files"

for filename in os.listdir(folder):
    if not filename.endswith(".js"):
        continue

    path = os.path.join(folder, filename)

    with open(path, encoding="utf-8", errors="ignore") as f:
        js = f.read()

    print(f"\n{'=' * 55}")
    print("FILE:", filename)
    print("SIZE:", len(js))

    patterns = {
        "API / ENDPOINT": r"""["'`](?:/api/|/graphql|[^"'`]{0,80}/api/)[^"'`]{0,180}["'`]""",
        "IMPORT JS": r"""(?:import|import\()[^"'`]*["'`]([^"'`]+\.js(?:\?[^"'`]*)?)["'`]""",
        "ROUTE": r"""["'`]([^"'`]{0,100}(?:explore|search|series|chapter)[^"'`]{0,150})["'`]""",
        "FETCH": r"""fetch\([^)]{1,250}\)""",
    }

    for label, pattern in patterns.items():
        matches = list(dict.fromkeys(re.findall(pattern, js, re.I)))
        if matches:
            print(f"\n[{label}]")
            for item in matches[:60]:
                print(item)
