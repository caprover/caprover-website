#!/usr/bin/env node
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve("content");
const sourceDir = path.join(root, "en", "docs-next");
const locales = ["es-ES", "zh-CN"];

function walk(dir, prefix = "") {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const relative = path.join(prefix, entry.name);
    return entry.isDirectory()
      ? walk(path.join(dir, entry.name), relative)
      : entry.name.endsWith(".md") ? [relative] : [];
  }).sort();
}
function fences(text) {
  const blocks = [];
  let current = null;
  for (const line of text.split("\n")) {
    const marker = line.match(/^\s*(`{3,}|~{3,})/);
    if (marker) {
      if (current === null) current = [line];
      else {
        current.push(line);
        blocks.push(current.join("\n"));
        current = null;
      }
    } else if (current !== null) current.push(line);
  }
  assert.equal(current, null, "Unclosed code block");
  return blocks;
}
function noCode(text) {
  return text.replace(/^\s*(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\s*(?:`{3,}|~{3,})/gm, "")
    .replace(/`[^`\n]*`/g, "");
}
function numbers(text) {
  const cleaned = noCode(text)
    .replace(/\]\([^)]+\)/g, "]")
    .replace(/https?:\/\/\S+/g, "");
  return new Set([...cleaned.matchAll(/(?<![A-Za-z_])\d+(?:\.\d+)*(?:\/\d+)?/g)]
    .map((match) => match[0]));
}
function linkTargets(text) {
  return [...text.matchAll(/!?\[[^\]\n]*\]\(([^)\n]+)\)/g)].map((x) => x[1]);
}
function inlineCode(text) {
  return [...text.matchAll(/`([^`\n]+)`/g)].map((x) => x[1]);
}
function frontmatter(text, key) {
  return text.match(new RegExp("^" + key + ":\\s*(.+)$", "m"))?.[1] ?? null;
}
const files = walk(sourceDir);
assert.equal(files.length, 48, "Expected all 48 canonical source pages");
const errors = [];
for (const locale of locales) {
  const destination = path.join(root, locale, "docs-next");
  assert.deepEqual(walk(destination), files, locale + " has incomplete page coverage");
  for (const relative of files) {
    const source = readFileSync(path.join(sourceDir, relative), "utf8");
    const translated = readFileSync(path.join(destination, relative), "utf8");
    const prefix = locale + "/" + relative;
    if (JSON.stringify(fences(source)) !== JSON.stringify(fences(translated))) {
      errors.push(prefix + ": fenced code differs");
    }
    if (JSON.stringify(linkTargets(source)) !== JSON.stringify(linkTargets(translated))) {
      errors.push(prefix + ": Markdown link destinations differ");
    }
    if (JSON.stringify(inlineCode(source)) !== JSON.stringify(inlineCode(translated))) {
      errors.push(prefix + ": inline code differs");
    }
    for (const key of ["id", "slug"]) {
      if (frontmatter(source, key) !== frontmatter(translated, key)) {
        errors.push(prefix + ": frontmatter " + key + " differs");
      }
    }
    const a = numbers(source), b = numbers(translated);
    const missing = [...a].filter((number) => !b.has(number));
    const extra = [...b].filter((number) => !a.has(number));
    if (missing.length || extra.length) {
      errors.push(prefix + ": numeric tokens changed (missing " + missing.join(", ") +
        "; unexpected " + extra.join(", ") + ")");
    }
  }
}
if (errors.length) {
  console.error(errors.join("\n"));
  throw new Error(errors.length + " translation integrity failures");
}
console.log("Translation integrity verified: 48 pages × 2 locales");
