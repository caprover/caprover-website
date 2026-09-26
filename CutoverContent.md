Cutover happens only after explicit approval.

## Step 1: Freeze the information architecture

Do not begin redirect work while page locations are still changing substantially.

## Step 2: Finalize the URL mapping

Enumerate every current `/docs/*` page.

Classify each page as:

- same path
- moved
- split
- intentionally removed

For split or removed pages, select the closest useful destination.

Do not redirect generic old pages blindly to `/docs`.

## Step 3: Prepare localization

Decide how the new English structure maps to translated content.

Update the localization tooling as required.

## Step 4: Promote the new docs

Conceptually change:

```text
/docs-next/*
```

to:

```text
/docs/*
```

Remove the old docs instance.

Update:

- docs plugin configuration
- sidebars
- navbar
- footer
- edit links
- search
- sitemap
- localization configuration

## Step 5: Add legacy redirects

Add redirects only where the old URL differs from the final new URL.

Examples:

```text
/docs/app-configuration
→ /docs/applications

/docs/app-scaling-and-cluster
→ /docs/scaling
```

Pages whose paths remain identical require no redirect.

Avoid redirect chains.

## Step 6: Remove `/docs-next`

After cutover there should be one canonical documentation site.

Do not permanently serve duplicate copies at both `/docs` and `/docs-next`.

## Step 7: Validate legacy links

Explicitly test high-value historical URLs such as:

```text
/docs/get-started
/docs/app-configuration
/docs/deployment-methods
/docs/persistent-apps
/docs/app-scaling-and-cluster
/docs/backup-and-restore
/docs/troubleshooting
```
