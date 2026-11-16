
import os
import re

patterns = {
    "API_PATH": r"""["'`](/(?:api|v\d+)/[^"'` ]{1,180})["'`]""",
    "FETCH": r"""fetch\([^)]{1,350}\)""",
    "ENDPOINT": r"""["'`]([^"'` ]{0,150}(?:series|explore|search|chapter)[^"'` ]{0,150})["'`]""",
    "GRAPHQL": r"""[^"'` ]{0,100}graphql[^"'` ]{0,100}""",
}

for root, dirs, files in os.walk("modules"):
    for filename in files:
        if not filename.endswith(".js"):
            continue

        path = os.path.join(root, filename)

        with open(path, encoding="utf-8", errors="ignore") as f:
            source = f.read()

        print("\n###", path)

        for label, pattern in patterns.items():
            matches = list(dict.fromkeys(
                re.findall(pattern, source, re.I)
            ))

            for match in matches[:25]:
                print(label + ":", match)
