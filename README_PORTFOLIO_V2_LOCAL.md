# Portfolio v2 — local review

This folder is a local-only review build on branch `portfolio-v2-local`.
The remote repository was not changed.

## Run locally

From this folder:

```bash
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173/`.

The default language is English. Use `EN | ES` in the top bar. The Projects
route contains the Horizon Fixture case study and the Mechanical Design
Gallery.

## CAD replacement contract

The gallery reads `window.CAD_PROJECTS` from `src/data.js`. Each record keeps
layout-independent metadata and optional `preview`, `additionalImages`,
`drawing` and `model3d` fields. The current records are curated from the
available academic CAD/CAM and additive-manufacturing evidence.

The native archive was incomplete in the Drive folder: the multipart ZIP
contains volumes `.z01` through `.z11` and the final `.zip`, but `.z12` was not
present. A valid partial archive was recovered and all records currently shown
are backed by files that passed integrity testing. The missing volume is still
needed before claiming that every archive entry has been reviewed.

Only optimized presentation assets are intended for publication. Source CAD
files are not automatically exposed as downloads.

## Validation

Run `node scripts/validate-cad-gallery.mjs` after replacing or adding gallery
records. It checks localized records, optional media paths, missing assets and
accidental publication of native CAD formats.
