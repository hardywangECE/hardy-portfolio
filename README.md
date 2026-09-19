# Hardy Wang — Portfolio

A dependency-free static portfolio site with interactive, in-browser CAD viewers for PCB projects. STEP files are parsed and rendered client-side with WebGL — no server, no build step, no backend.

## How it works

- **No bundler.** Plain HTML/CSS/JS with native ES modules and an [import map](projects.html) so the browser resolves `three` directly to a vendored copy — nothing to compile.
- **Multi-page.** `index.html` (hero, quick links, skills, contact), `about.html`, `experience.html`, and `projects.html` are separate pages sharing one stylesheet. [js/common.js](js/common.js) holds the behaviour every page needs (theme toggle, nav, reveal-on-scroll); each page has a thin entry script ([js/home.js](js/home.js), [js/about.js](js/about.js), [js/experience.js](js/experience.js), [js/projects.js](js/projects.js)) that renders its own content from `data.js` and calls `initPage()`.
- **3D viewer** ([js/viewer.js](js/viewer.js)), used only on `projects.html`, uses [occt-import-js](https://github.com/kovacsv/occt-import-js) (OpenCascade compiled to WebAssembly) to parse `.step` files straight into a `three.js` scene, with `OrbitControls` for rotate/pan/zoom — the same manipulation as Altium's 3D view. Each project's viewer lazy-loads only when scrolled into view.
- **Content** lives in [js/data.js](js/data.js) — edit that file to update your bio, experience, skills, or project copy without touching HTML/CSS.

## Editing content

Open [js/data.js](js/data.js). Everything on every page (except headings/labels baked into each `.html` file) is generated from that file:

- `profile` — name, tagline, email, LinkedIn, resume path.
- `education`, `skills`, `experience` — straightforward arrays/objects.
- `projects` — each entry can include a `model` path to a `.step` file for an interactive viewer, and an optional `future` string rendered as a dashed "planned iteration" callout. Leave `model` out to render a text-only project card.

## Adding a new project with a 3D model

1. Drop the `.step` file in `assets/models/`.
2. Add an entry to the `projects` array in `js/data.js` pointing `model` at that path.

That's it — the viewer, lazy-loading, and toolbar (reset/wireframe/auto-rotate/fullscreen) are shared across all projects.

## Local development

No install beyond `npm install` (only used to vendor `three` and `occt-import-js` — see `vendor/`). To preview locally you need any static file server, since ES modules and `fetch()` don't work over `file://`. A zero-dependency one is included:

```bash
npm start
```

Then open `http://localhost:5500`.

## Deploying to GitHub Pages

This is a static site, so GitHub Pages can serve it directly from the repo — no Actions workflow required.

1. Create a new GitHub repository (e.g. `hardy-portfolio`) and push this project:
   ```bash
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git branch -M main
   git push -u origin main
   ```
2. In the repo on GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, then pick **Branch: main, folder: / (root)**.
3. Your site will be live at `https://<your-username>.github.io/<repo-name>/` within a minute or two.

If you want it at the root of `https://<your-username>.github.io/` instead, name the repository `<your-username>.github.io`.

### Note on file sizes

The three `.step` files in `assets/models/` total ~18 MB. That's fine for GitHub (well under its 100 MB per-file limit) and for Pages, but it does mean first-time visitors download the full STEP source for whichever project they view — that's the trade-off for true "upload the CAD file, get an interactive viewer" simplicity with no build pipeline. If you outgrow it, pre-baking each STEP file to a compressed `.glb` (e.g. with `occt-import-js` run offline through a newer Node.js, since this repo's dev machine had Node 14) would cut viewer payloads by 80%+ with no page-level changes needed beyond swapping the loader.
