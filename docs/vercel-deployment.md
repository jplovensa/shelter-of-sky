# Deploy Shelter of Sky to Vercel

Import **jplovensa/shelter-of-sky**, branch **main**, into Vercel. Keep the **Root Directory at the repository root** (leave it blank), and choose the **Other** framework preset. The committed `vercel.json` supplies:

| Setting | Value |
| --- | --- |
| Build command | `node tools/check-deployment.mjs` |
| Output directory | `dist` |
| Install command | Empty — dependencies are already bundled |
| Environment variables | None |

Do not set Root Directory to `dist`: the configuration and preflight live at the repository root. No SketchUp conversion, texture generation or dependency download is needed during deployment. The complete viewer, optimized models, Three.js modules, HDR environment, fonts, branding and catalogue textures are committed under `dist`.

The build validates JavaScript syntax, module imports, model headers and required texture assets. Only `dist` is published; repository documentation and conversion tools are outside the served output. No wildcard rewrite is needed: collection links use query parameters on the home page, and missing assets should return 404 rather than HTML.

After importing, click **Deploy**. For future changes, pushing to the connected production branch triggers Vercel's Git deployment. Existing GitHub Pages publication can remain in place.

## Verify the deployed URL

Open the Vercel URL and wait for **ready** and the complete 3D villa. Check these links on that same origin:

- `/?scheme=tropical`
- `/?scheme=mediterranean`
- `/?scheme=scandi`

Review the dining room, bedrooms and pool; open all eight doors; try Walk through; change a bedside lighting preset at dusk; and open each collection's original moodboard. A successful build validates the package, while these browser checks confirm rendering on the deployed host.

## Local preflight

With Node.js installed, run `node tools/check-deployment.mjs` from the repository root. To preview the unchanged static output, run `python3 -m http.server 8771 --directory dist` and visit `http://localhost:8771`.

Configuration follows Vercel's [project configuration](https://vercel.com/docs/project-configuration/vercel-json) and [build settings](https://vercel.com/docs/builds/configure-a-build) documentation.
