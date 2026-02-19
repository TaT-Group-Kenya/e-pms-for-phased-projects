#!/usr/bin/env python3
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OPENAPI = ROOT / 'public' / 'swagger-ui' / 'openapi.json'

# map lowercase old -> lowercase new
REPLACEMENTS = {
    'countrys': 'countries',
    'currencys': 'currencies',
    'order-tax-itemss': 'order-tax-items',
    'project-categorys': 'project-categories',
}


def preserve_case(repl: str, original: str) -> str:
    # preserve capitalization style of original
    if original.isupper():
        return repl.upper()
    if original.istitle():
        return repl.title()
    if original.islower():
        return repl.lower()
    # mixed case: fallback to repl
    return repl


def replace_ci(text: str) -> str:
    # for each replacement, perform case-insensitive replacement
    for old, new in REPLACEMENTS.items():
        pattern = re.compile(re.escape(old), re.IGNORECASE)

        def _sub(m):
            orig = m.group(0)
            return preserve_case(new, orig)

        text = pattern.sub(_sub, text)
    return text


def main():
    raw = OPENAPI.read_text()
    patched = replace_ci(raw)

    # also fix path segments that include leading slash variants (e.g. /countrys)
    patched = patched.replace('/countrys', '/countries').replace('/currencys', '/currencies')
    patched = patched.replace('/order-tax-itemss', '/order-tax-items')
    patched = patched.replace('/project-categorys', '/project-categories')

    # validate JSON
    try:
        json.loads(patched)
    except Exception as e:
        print('Failed to parse patched JSON:', e)
        return

    OPENAPI.write_text(patched)
    print('Patched openapi.json (case-insensitive replacements applied)')


if __name__ == '__main__':
    main()
