# Documentation URL and anchor compatibility audit

Baseline website: `a50858c` (master before this change). Audited on 2026-11-02.

## Evidence and inventory

`DOCS_CONSOLIDATION_MAP.json` remains the authority for path destinations. The compatibility inventory freezes historical source requirements; it does not replace the consolidation map.

- `docs-compat/historical-routes.json`: 642 normalized public sources, locale, provenance key, canonical ownership, and four supported URL forms.
- `docs-compat/historical-anchors.json`: rendered article element IDs, with source revisions. HTML is parsed with Cheerio, including explicit spans and localized IDs. Text such as `node.id==...` inside code blocks is excluded.
- `docs-compat/anchor-overrides.json`: reviewed section exceptions with semantic reasons, plus two preview fallback types.
- `docs-compat/official-links.json`: repository revisions, file and line references, and explicitly excluded illustrative `...` placeholders.
- `docs-compat/audit-summary.json`: deterministic machine-readable verification totals.
- The assembled `docs-redirect-manifest.json` records each source, default destination, every fragment destination, and its resolution policy. CI uploads it with the complete site preview.

| Historical evidence | English | Spanish | Chinese | Total |
| --- | ---: | ---: | ---: | ---: |
| Legacy documents | 36 | 36 | 36 | 108 |
| Legacy article IDs | 217 | 218 | 217 | 652 |
| Preview documents, including Manual Setup | 142 | 142 | 142 | 426 |
| Preview article IDs | 50 | 50 | 50 | 150 |
| All historical documents | 178 | 178 | 178 | 534 |
| All historical IDs | 267 | 268 | 267 | 802 |

The 141 original preview routes were rebuilt at `b15f34e24ae9a367d98cf902e1fd65d034b61200` in a separate worktree. All three locale builds succeeded. The old localized previews used English fallback content; their original English heading IDs therefore need translation-aware compatibility too.

Manual Setup was added after that baseline. Its English source is byte-identical to revision `f0b3079`, verified by the capture script before using the current English render as historical evidence. The historical localized previews also used that English content. A source change makes this check fail and requires rebuilding the recorded historical revision.

The archive has 652 genuine article IDs across locales. Before compatibility aliases, 215/217 English, 216/218 Spanish, and 215/217 Chinese IDs were absent from the intended modern destination. These counts compare sections, rather than HTTP status or page titles.

## Resolution policy

1. No fragment: use the current canonical document in the source locale.
2. Reviewed override: use its current equivalent section.
3. An unchanged ID in the intended current document: retain it.
4. Legacy section without a verified current equivalent: use its original localized archive and original ID.
5. Changed preview subsection: use its verified consolidated `source-*` marker. Retained preview headings that changed are explicitly mapped. The retired Play With Docker preview uses the Standard VPS section; the original index uses the preserved `source-index` section.
6. Unknown fragments: preserve the supplied value and classify compatibility as unguaranteed. They are excluded from verified historical totals.

Examples of reviewed current mappings include persistent directories, replica count, placement, private registries, database connections, backup automation, Docker Compose supported fields, and broken-dashboard NGINX recovery. Old community framework links, detailed GitHub workflow alternatives, OpenStack Heat instructions, and removed troubleshooting procedures remain in their original archive sections.

The three overlapping current routes (`get-started`, `one-click-apps`, and `troubleshooting`) retain their Docusaurus HTML. Small explicit spans preserve equivalent historical anchors, including each locale's 502 section. A bounded compatibility script handles remaining known historical IDs and canonical `.html` navigation. Docusaurus's route lifecycle hook also invokes it after client navigation. Currently valid IDs are left intact.

Redirect resolution uses the same pure function in tests and generated HTML. It preserves the query string, decodes fragment lookup safely, restricts destinations to local final documents, and replaces history. Meta refresh runs only inside `noscript`. Archive roots use the same redirect renderer.

Section URLs and archives remain in the requested language. A saved/browser locale preference cannot silently move their fragment to another language. Explicit `/docs/en/...` aliases also retain English when a different language was previously saved.

## Verified results

| Check | Result |
| --- | ---: |
| Legacy English routes | 36/36 |
| Retired preview routes per locale | 142/142 |
| Current documents across locales | 144/144 |
| Normalized historical public sources, including locale aliases | 642/642 |
| URL forms validated | 2,568/2,568 |
| Historical article IDs | 802/802 |
| Unchanged current section destinations | 41 |
| Explicit equivalent current section destinations | 151 |
| Preview source-section destinations | 49 |
| Verified historical archive section destinations | 561 |
| Fragment cases including alias and URL-form expansion | 5,872/5,872 |
| Captured official repository references | 30/30 |
| Broken known official references after resolution | 0 |
| Redirect cycles / output collisions / missing localized targets | 0 / 0 / 0 |
| Unknown or unresolved inventoried historical IDs | 0 |

The four URL forms are extensionless, trailing slash, `.html`, and `/index.html`. The three standard locale paths and the historical `/docs/{locale}/...` aliases are covered. Preview roots count as original inventory entries. Generated redirect files are build artifacts, not committed source files.

Fragment counts above count distinct historical evidence once. The machine summary additionally counts each alias and URL form. Pre-existing stale references are separate from rendered historical anchors: the CLI README's `#caprover-setup` goes to current server configuration; the DigitalOcean script's `#step-3-install-caprover-cli` goes to the explicitly marked CLI installation instructions. Neither ID existed in the preserved legacy archive.

The official source scan covers current tracked text in `caprover/caprover`, `caprover/caprover-cli`, `caprover/caprover-website`, `caprover/one-click-apps`, and `caprover/deploy-from-github`. It includes the deployed 502 message, installer output, DigitalOcean/OpenStack scripts, sample apps, CLI README, available CHANGELOG references, One-Click template instructions, and registry links in archived CI/CD guidance. Repository-root public links are supported by the capture tool. It is a bounded scan of the recorded revisions, rather than every historical release revision.

## Verification commands

Run from the repository root unless a subshell specifies otherwise:

```bash
node scripts/check-docs-consolidation.mjs
node scripts/check-docs-translations.mjs
(cd docs-site && npm ci && npm run clean-build)
(cd marketing-site && npm ci && npm run lint && npm run format:check && npm test)
node --test scripts/docs-redirects.test.mjs
node scripts/compose-site.mjs
node scripts/smoke-combined-site.mjs
node scripts/check-docs-redirects.mjs
(cd docs-site && npx playwright install --with-deps chromium)
docs-site/node_modules/.bin/playwright test
```

Local results: consolidation and translation checks passed; documentation builds succeeded for all three locales; marketing lint and formatting passed; all 3 marketing export tests passed; all 22 resolver/build regression tests passed; combined HTTP smoke test passed; exhaustive compatibility validation passed; all 23 Chromium navigation tests passed.

Browser cases include the runtime 502 URL in all four forms with a visible section target, archived GitHub Actions guidance, preview subsection mappings, Spanish and Chinese routes, encoded localized IDs, query preservation, current anchors, hash changes, back/forward, saved/browser preferences, client navigation, unknown fragments, and JavaScript-disabled fallbacks. Ten category reviews verify actual target heading text: installation, app configuration, persistent apps, Compose, One-Click, NGINX, backups, multi-node, removed troubleshooting, and historical OpenStack.

The integration workflow runs the new unit tests, exhaustive validator, and Chromium suite. Canonical metadata, archive noindex, redirect noindex/follow, sitemap inclusion/exclusion and uniqueness, duplicate IDs, unsafe destinations, missing translations, missing sections, redirect chains/cycles, and canonical output collisions are checked. Composition preserves source documentation/archive HTML before injecting the shared scripts, and preserves images and marketing output through the existing integration checks.

### Reproduce the historical inventory

```bash
git worktree add /tmp/caprover-docs-history b15f34e24ae9a367d98cf902e1fd65d034b61200
(cd /tmp/caprover-docs-history/docs-site && npm ci && npm run clean-build)
# Build the current docs as above, then:
node scripts/capture-docs-history.mjs /tmp/caprover-docs-history
node scripts/check-docs-redirects.mjs --capture-routes --write-summary
git diff -- docs-compat
```

To repeat the official-source scan, clone the five repositories and check out the exact SHAs in `docs-compat/official-links.json`. Pass those directories in this order:

```bash
node scripts/capture-official-docs-links.mjs WEBSITE CAPROVER CLI ONE_CLICK_APPS DEPLOY_FROM_GITHUB
```

An intentional future documentation reorganization must retain the frozen historical evidence, update the consolidation destinations and reviewed exceptions, and rerun the validator. Use `--capture-routes` only after reviewing source inventory changes. Use `--write-summary` to refresh the committed totals after intentional changes.

## Limitations and release verification

- Unknown fragments have no historical evidence and retain their incoming value. A confirmed inventoried fragment with a missing final element fails validation.
- JavaScript-free redirect pages can navigate to their default relevant document or source marker and expose an accessible link. Static HTML cannot conditionally map an arbitrary incoming fragment or copy its query string. Direct canonical 502 aliases work without JavaScript. The browser suite verifies these supported fallbacks.
- Historical anchor evidence is the requested original preview revision plus the preserved legacy archive and Manual Setup addendum. Unrecorded intermediate revisions may contain additional IDs. Add newly discovered deployed references to the inventory and explicit overrides.
- Public deployment verification is pending merge and GitHub Pages deployment. This PR does not merge itself or publish a replacement hosting architecture.

After deployment, record the deployment SHA and verification time. Compare the published manifest and audit summary with the successful CI artifact, check all 2,568 published source forms, and rerun representative Chromium flows against `https://caprover.com`, including the 502 message and localized archives. Record routes/fragments checked and any differences before marking the production rollout verified.
