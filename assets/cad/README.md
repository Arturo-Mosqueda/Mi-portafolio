# CAD asset contract

This folder is intentionally separated from the layout code. `window.CAD_PROJECTS`
in `src/data.js` is the source of truth for the Mechanical Design Gallery.

Each record supports:

- `preview`: one optimized thumbnail or render;
- `images` / `additionalImages`: optional supporting views;
- `drawing`: optional engineering drawing;
- `model3d`: optional `.glb` or `.gltf` web model loaded only on the piece page;
- localized `name`, `category`, `techniques` and `description` values;
- `placeholder: false` for the curated records currently backed by extracted
  academic evidence.

The current gallery uses lightweight previews rendered from the available
engineering drawings, reports and simulation evidence. The native source files
were used for inventory and grouping only and are not copied into this site.

When a complete `CAD_Todas_Las_Piezas_UNAQ.zip` is available, the intended
replacement workflow is:

1. inspect and group the source files;
2. select presentable pieces;
3. generate optimized thumbnails/renders and optional GLB/GLTF files;
4. fill or refine the metadata records;
5. replace only the relevant `preview`, `images`, `drawing` and optional
   `model3d` fields;
6. verify every gallery and detail route.

Source CAD files (`SLDPRT`, `SLDASM`, `SLDDRW`, `F3D`, `STEP`, `IGES`) are not
published by this portfolio automatically. The current site contains only
presentation assets and the supplied Horizon Fixture evidence.

Suggested folders:

```text
cad/
├── thumbnails/
├── renders/
├── drawings/
├── models/
└── horizon-fixture/
```

The `models/` directory is reserved for optimized web-safe GLB/GLTF files.
Original `SLDPRT`, `SLDASM`, `SLDDRW`, `F3D`, `STEP` and `IGES` files must not be
published automatically.
