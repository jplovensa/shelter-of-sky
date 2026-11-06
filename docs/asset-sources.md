# Asset sources

- Architecture: user-provided `echo 3 - 17 FEB1.skp`.
- Modern Tropical moodboard: user-provided `To Breathe_FG Signature Catalogue.pdf`, page 11, original page rendered without redesign.
- Exterior finishes: same catalogue, page 6.
- Fjäll Group logo: existing project transparent RGBA logo, verified alpha spans 0-255.
- Teak, linen, plaster and HDRI: Poly Haven CC0; individual credits in `dist/assets/realism/credits.json`. Linen diffuse is neutralized for catalogue colours; its photographed weave is retained.
- Water renderer, water normals and RoundedBoxGeometry: official Three.js r170 examples, https://github.com/mrdoob/three.js/tree/r170/examples ; MIT license in `dist/vendor/THREE-LICENSE.txt`.
- Tile, lava, terrazzo, rattan and microcement texture maps: project procedural materials, `tools/build-surfaces.py`.
- Superseded AI concept moodboard is excluded from the published viewer and repository assets.
