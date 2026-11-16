# Domain map

What this repository publishes at `jasencarroll.com`, what it only links to, and where the domain itself is controlled.

## Ownership

| Address | Served by | Deployed through |
| --- | --- | --- |
| `https://jasencarroll.com/` and its pages, e.g. `/local-assistant.html`, `/milky.html` | this repository (`jasenc7/jasenc7.github.io`) | this repo's `deploy.yml` → `github-pages` environment; see [publishing](./publishing.md) |
| `https://jasencarroll.com/milky/` | the separate Milky project | Milky's own project Pages deployment, independent of this repo |
| `qms.`, `goodware.`, `cafe-fausse.`, `recipe-recommender.jasencarroll.com` | other hosts | not this repository; the home page only links to them |

## Custom domain declaration

`public/CNAME` contains `jasencarroll.com`. It is this repository's record of the site's custom domain, and VitePress copies it into every built artifact.

GitHub honours the **Custom domain** value in the repository's *Settings → Pages* when it serves the site. Because this site is published by a custom GitHub Actions workflow, GitHub ignores the `CNAME` file itself ([GitHub docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)). Keep `public/CNAME` and the Pages setting in agreement, and treat the setting as the binding that actually takes effect.

## DNS is separate from publishing

DNS records for `jasencarroll.com` are managed at the domain's DNS provider. Nothing in this repository or its workflow changes them.

An ordinary site publication (a merge to `main`, a workflow re-run or a manual dispatch) changes the files served at the domain. It never changes the domain, its DNS or the Pages custom-domain setting. Changing any of those is a separate operation and is never part of publishing or rolling back content.

The analytics selection, the Cloudflare Web Analytics beacon in `.vitepress/config.mts` under `head`, is also outside publishing changes.

## Milky stays independent

Milky has its own source, build artifact and project Pages deployment, served at `/milky/`.

In this repository, Milky appears only as:

- the article `milky.md`, which builds to `/milky.html` (a different path from `/milky/`)
- a sidebar entry and a home-page feature card pointing at that article
- links inside the article to `https://jasencarroll.com/milky/`

Those links are navigation only. The root build doesn't fetch, copy or bundle Milky's assets, and there is no aggregator that combines the two deployments. Deploying or rolling back the root site leaves Milky as it is, and the reverse is also true.
