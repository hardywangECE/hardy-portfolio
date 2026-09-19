# Hardy Wang — Portfolio

A dependency-free static portfolio site with interactive, in-browser CAD viewers for PCB projects. STEP files are parsed and rendered client-side with WebGL — no server, no build step, no backend.

## How it works

- **No bundler.** Plain HTML/CSS/JS with native ES modules and an [import map](projects.html) so the browser resolves `three` directly to a vendored copy — nothing to compile.
- **Multi-page.** `index.html` (hero, quick links, skills, contact), `about.html`, `experience.html`, and `projects.html` are separate pages sharing one stylesheet. [js/common.js](js/common.js) holds the behaviour every page needs (theme toggle, nav, reveal-on-scroll); each page has a thin entry script ([js/home.js](js/home.js), [js/about.js](js/about.js), [js/experience.js](js/experience.js), [js/projects.js](js/projects.js)) that renders its own content from `data.js` and calls `initPage()`.
- **3D viewer** ([js/viewer.js](js/viewer.js)), used only on `projects.html`, renders with `three.js` and `OrbitControls` for rotate/pan/zoom — the same manipulation as Altium's 3D view. It supports two source formats:
  - **`.glb`** (preferred) — pre-tessellated binary geometry, loads in well under a second.
  - **`.step`** — parsed live in the browser with [occt-import-js](https://github.com/kovacsv/occt-import-js) (OpenCascade compiled to WebAssembly). Works with zero prep, but STEP interpretation is genuinely slow (multiple seconds to over ten, depending on the file) — that cost is in OpenCascade's geometry kernel, not this site's code, and isn't something tessellation settings fix.

  Every solid in a model is merged into a single mesh/draw call (`buildModelGroup`, using `vendor/three/BufferGeometryUtils.js`) regardless of source format — a board can easily have 1000+ separate solids, and rendering each as its own draw call is slow to orbit even after it's loaded. Each project's viewer lazy-loads only when scrolled into view.
- **Content** lives in [js/data.js](js/data.js) — edit that file to update your bio, experience, skills, or project copy without touching HTML/CSS.

## Editing content

Open [js/data.js](js/data.js). Everything on every page (except headings/labels baked into each `.html` file) is generated from that file:

- `profile` — name, tagline, email, LinkedIn, resume path.
- `education`, `skills`, `experience` — straightforward arrays/objects.
- `projects` — each entry can include a `model` path to a `.step` or `.glb` file for an interactive viewer, and an optional `future` string rendered as a "planned iteration" callout. Leave `model` out to render a text-only project card.

## Adding a new project with a 3D model

1. Drop the `.step` file in `assets/models/`.
2. Add an entry to the `projects` array in `js/data.js` pointing `model` at that path.

That's enough to work immediately — the viewer, lazy-loading, and toolbar (reset/auto-rotate/fullscreen) are shared across all projects. But loading raw STEP client-side is slow (see above), so before you ship it:

3. Run `npm start`, open `bake-step.html`, and click **Bake all** (or the button for just the new model). This parses the STEP file once, merges it, and saves a `.glb` into `assets/models/` via a small local-only endpoint in `scripts/serve.js` (never runs in production — GitHub Pages only serves static files).
4. Point that project's `model` field at the new `.glb` instead of the `.step` file.

The original `.step` files are kept in the repo as source — re-run the bake tool any time you replace one.

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

Visitors load the baked `.glb` files (a few MB each), not the original `.step` sources (which total ~18 MB and stay in the repo purely as source material for re-baking). GitHub's fine with either — well under its 100 MB per-file limit — this is purely about what a visitor's browser has to fetch and parse.
