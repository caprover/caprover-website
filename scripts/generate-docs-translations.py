#!/usr/bin/env python3
"""Draft translations for new documentation. Review technical prose before publishing."""
from __future__ import annotations
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "content/en/docs-next"
TARGETS = {"es-ES": "es", "zh-CN": "zh"}

LINK = re.compile(r'(!?\[)([^\]\n]*)(\]\()([^\)\n]+)(\))')
CODE = chr(96)
PROTECTED = re.compile(r'(?:'+CODE+r'[^'+CODE+r'\n]*'+CODE+r'|\*\*[^*\n]+\*\*|<[^>\n]+>|https?://[^\s)]+|\b(?:CAPROVER|MAIN_NODE|ONE_CLICK)_[A-Z0-9_]+\b)')
FENCE = re.compile(r'^\s*('+CODE+r'{3,}|~{3,})')
HEADING = re.compile(r'^(#{1,6}\s+)(.+)$')
BULLET = re.compile(r'^(\s*(?:[-+*]|\d+\.)\s+)(.+)$')
FIELD = re.compile(r'^(id|slug|sidebar_position|sidebar_label|title):\s*(.*)$')

def translate_markup(text, translate):
    def plain(raw):
        if not re.search(r'[A-Za-z]{2,}', raw): return raw
        left=raw[:len(raw)-len(raw.lstrip())]
        right=raw[len(raw.rstrip()):]
        result=translate(raw.strip())
        if not result.strip(): raise ValueError("Empty translation: "+repr(raw[:80]))
        return left+result+right
    def inner(raw):
        out=[]; start=0
        for found in PROTECTED.finditer(raw):
            out.append(plain(raw[start:found.start()]))
            token=found.group(0)
            if token.startswith("**") and token.endswith("**"):
                token="**"+translate_markup(token[2:-2],translate)+"**"
            out.append(token)
            start=found.end()
        out.append(plain(raw[start:]))
        return "".join(out)
    out=[]; start=0
    for found in LINK.finditer(text):
        out.append(inner(text[start:found.start()]))
        out.append(found.group(1)+inner(found.group(2))+found.group(3)+found.group(4)+found.group(5))
        start=found.end()
    out.append(inner(text[start:]))
    return "".join(out)

def translate_file(contents, translate):
    result=[]
    front=False; front_done=False; fenced=False; fence_char=""; fence_size=0
    for line in contents.splitlines(keepends=True):
        ending="\n" if line.endswith("\n") else ""
        body=line[:-1] if ending else line
        if not front_done and body.strip()=="---":
            front=not front
            if not front: front_done=True
            result.append(line); continue
        if front:
            field=FIELD.match(body)
            if field and field.group(1) in ("title","sidebar_label"):
                result.append(field.group(1)+": "+translate_markup(field.group(2),translate)+ending)
            else: result.append(line)
            continue
        fence=FENCE.match(body)
        if fence:
            marker=fence.group(1)
            if not fenced:
                fenced=True; fence_char=marker[0]; fence_size=len(marker)
            elif marker[0]==fence_char and len(marker)>=fence_size: fenced=False
            result.append(line); continue
        if fenced or body.lstrip().startswith(("<!--","<span","</span>","<svg","</svg>","<div","</div>")) or re.fullmatch(r'\s*\|?(\s*:?-+:?\s*\|)+\s*',body):
            result.append(line); continue
        heading=HEADING.match(body)
        bullet=BULLET.match(body)
        if heading: changed=heading.group(1)+translate_markup(heading.group(2),translate)
        elif bullet: changed=bullet.group(1)+translate_markup(bullet.group(2),translate)
        elif body.startswith("|") and body.endswith("|"):
            changed="|".join(translate_markup(cell,translate) for cell in body.split("|"))
        elif body.startswith("> "): changed="> "+translate_markup(body[2:],translate)
        else: changed=translate_markup(body,translate)
        result.append(changed+ending)
    return "".join(result)

def protected_fences(contents):
    output=[]; inside=False; lines=[]
    for line in contents.splitlines(keepends=True):
        if FENCE.match(line):
            if inside:
                lines.append(line); output.append("".join(lines)); lines=[]; inside=False
            else: inside=True; lines=[line]
        elif inside: lines.append(line)
    if inside: raise RuntimeError("Unclosed code block")
    return output

def validate(source, translated, path):
    if protected_fences(source)!=protected_fences(translated):
        raise RuntimeError(f"Code blocks changed: {path}")
    for field in ("id","slug"):
        rex=rf"^{field}:\s*(.+)$"
        if re.findall(rex,source,re.M)!=re.findall(rex,translated,re.M):
            raise RuntimeError(f"{field} changed: {path}")
    if [m.group(4) for m in LINK.finditer(source)]!=[m.group(4) for m in LINK.finditer(translated)]:
        raise RuntimeError(f"Link targets changed: {path}")
    inline=rf'{CODE}([^{CODE}\n]+){CODE}'
    if re.findall(inline,source)!=re.findall(inline,translated):
        raise RuntimeError(f"Inline code changed: {path}")
    if source.count("<span id=")!=translated.count("<span id="):
        raise RuntimeError(f"Anchors changed: {path}")

def main():
    import argostranslate.package
    import argostranslate.translate
    argostranslate.package.update_package_index()
    available=argostranslate.package.get_available_packages()
    files=sorted(SOURCE.rglob("*.md"))
    if len(files)!=48: raise RuntimeError(f"Expected 48 Markdown files, got {len(files)}")
    for locale,lang in TARGETS.items():
        package=next((p for p in available if p.from_code=="en" and p.to_code==lang),None)
        if not package: raise RuntimeError(f"Missing en->{lang} model")
        argostranslate.package.install_from_path(package.download())
        translate=argostranslate.translate.get_translation_from_codes("en",lang).translate
        for index,file in enumerate(files,1):
            relative=file.relative_to(SOURCE)
            original=file.read_text(encoding="utf8")
            localized=translate_file(original,translate)
            validate(original,localized,relative)
            dest=ROOT/"content"/locale/"docs-next"/relative
            dest.parent.mkdir(parents=True,exist_ok=True)
            dest.write_text(localized,encoding="utf8")
            print(f"[{locale} {index}/{len(files)}] {relative}",flush=True)

if __name__=="__main__": main()
