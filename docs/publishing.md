# Publishing the root site

How the site at `jasencarroll.com` gets from source in this repository to GitHub Pages, and how to roll it back. This page describes the route. It is not a record that any deployment happened: for that, check the workflow run and the `github-pages` environment on GitHub.

## Source

Authored content is:

- **Markdown pages.** Every `*.md` file in the repository becomes a page. VitePress uses the repository root as its source directory and `.vitepress/config.mts` sets no `srcExclude`. That covers the articles at the root (`index.md`, `local-assistant.md`, `milky.md` and the rest), and also `README.md` and these `docs/` files. The articles are what the sidebar and home page link to.
- **Site config.** `.vitepress/config.mts` holds the title, nav, sidebar, social links and the analytics script in `head`.
- **Theme.** `.vitepress/theme/` (`index.ts`, `style.css`) extends the default VitePress theme.
- **Static assets.** Everything in `public/` (`CNAME`, `logo.svg`, the PDFs and the verification `.txt` file) is copied as-is to the root of the built site.

## Generated output

`.vitepress/dist` is the build output. It is generated, not authored. It is listed in `.gitignore` and should never be edited or committed. The same goes for `.vitepress/cache`.

## Build

Dependencies are declared in `deno.json` (`vitepress` `^1.6.4` and `vue` `^3.5.32`). `deno.lock` pins the resolved versions. The lock is tracked in git even though `.gitignore` lists it, because ignore rules don't untrack a file git already tracks. Keep both files when changing dependencies.

```bash
deno install --allow-scripts
```

```bash
deno task build
```

`deno task build` runs `deno run -A npm:vitepress build`. The workflow runs the same command directly. There is no other build system.

## Workflow

`.github/workflows/deploy.yml` (“Deploy VitePress site to Pages”) runs on a push to `main`, a pull request against `main`, and `workflow_dispatch`.

| Job | Runs on | Steps |
| --- | --- | --- |
| `verify` | every trigger, `ubuntu-latest` | checkout (full history), set up Deno `v2.x`, `deno install --allow-scripts`, build, then upload `.vitepress/dist` with `actions/upload-pages-artifact@v4` |
| `deploy` | everything except pull requests, `ubuntu-latest` | `actions/deploy-pages@v5` into the `github-pages` environment, with `pages: write` and `id-token: write` |

A pull request stops after `verify`: the site is built and an artifact uploaded, but nothing is deployed. `verify` is the status check that branch protection requires, according to the comment in the workflow.

Concurrency:

- **Pull requests** use the group `verify-pr-<number>` with `cancel-in-progress: true`. A new push to a PR cancels that PR's older run and nothing else.
- **Everything else** shares the group `pages` with `cancel-in-progress: false`. Deployments run one at a time and a running deployment is never cancelled. GitHub keeps at most one pending run per group, so a newer pending run replaces an older pending one.

The uploaded artifact is a tar of the complete `.vitepress/dist`, named `github-pages`. Dotfiles are excluded. The workflow doesn't set `retention-days`, so the artifact expires after **1 day** (the action's default).

## Publication outputs

A deployment publishes the whole built site, not individual changed files:

- one HTML page per Markdown file, plus `404.html`
- the hashed JS/CSS bundles under `assets/`
- everything from `public/`, at the site root

The visible effect is that `https://jasencarroll.com/` serves the version of `main` that was built, with the assets it links to. The `docs/` pages are part of that output: `/docs/publishing.html` and `/docs/domain-map.html`.

## Rollback

Roll back with the same workflow. Don't hand-edit a deployment, and don't touch Pages settings, `CNAME` or DNS to undo a content change.

1. **Within the artifact's lifetime (1 day by default):** open the last good run of the workflow on `main` and re-run its `deploy` job. This redeploys that run's complete `github-pages` artifact. It fails once the artifact has expired.
2. **Otherwise:** revert only the commit or commits that introduced the bad change on `main` (with `git revert` via a pull request, not a history rewrite). Unrelated article edits made since are kept. The push to `main` rebuilds and deploys through the normal path.
3. To rebuild and redeploy `main` as it stands without a new commit, run the workflow manually (`workflow_dispatch`) on `main`.

After any of these, confirm the `deploy` job succeeded and that the `github-pages` environment points at the expected run.

See also: [domain map](./domain-map.md).
