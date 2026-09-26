- [ ] Obtain explicit approval before cutover.

## Step 1: Freeze the information architecture

- [ ] Confirm page locations are stable enough to begin redirect work.

## Step 2: Finalize the URL mapping

- [ ] Enumerate every current `/docs/*` page.
- [ ] Classify each page as:
  - same path
  - moved
  - split
  - intentionally removed
- [ ] For split or removed pages, select the closest useful destination.
- [ ] Verify generic old pages are not blindly redirected to `/docs`.

## Step 3: Prepare localization

- [ ] Decide how the new English structure maps to translated content.
- [ ] Update the localization tooling as required.

## Step 4: Promote the new docs

- [ ] Change:

```text
/docs-next/*
```

to:

```text
/docs/*
```

- [ ] Remove the old docs instance.
- [ ] Update:
  - [ ] docs plugin configuration
  - [ ] sidebars
  - [ ] navbar
  - [ ] footer
  - [ ] edit links
  - [ ] search
  - [ ] sitemap
  - [ ] localization configuration

## Step 5: Add legacy redirects

- [ ] Add redirects only where the old URL differs from the final new URL.

Examples:

```text
/docs/app-configuration
→ /docs/applications

/docs/app-scaling-and-cluster
→ /docs/scaling
```

- [ ] Confirm pages whose paths remain identical require no redirect.
- [ ] Verify there are no redirect chains.

## Step 6: Remove `/docs-next`

- [ ] Remove `/docs-next` after cutover.
- [ ] Confirm there is one canonical documentation site.
- [ ] Confirm duplicate copies are not permanently served at both `/docs` and `/docs-next`.

## Step 7: Validate legacy links

- [ ] Test each high-value historical URL:
  - [ ] `/docs/get-started`
  - [ ] `/docs/app-configuration`
  - [ ] `/docs/deployment-methods`
  - [ ] `/docs/persistent-apps`
  - [ ] `/docs/app-scaling-and-cluster`
  - [ ] `/docs/backup-and-restore`
  - [ ] `/docs/troubleshooting`
