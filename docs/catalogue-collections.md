# Shelter of Sky — catalogue collections

All collections use the same converted SketchUp architecture, corrected bedroom approach, 6.0 × 2.0 m pool, eight interactive doors and four controllable bedside lights. The collection selector changes the full interior without reloading the model, keeping the active room, door positions, ambiance and bedside settings. Source/original finishes remain available.

## 01 Modern Tropical — catalogue page 11

The established teak, microcement, zellige, terrazzo and rattan collection is retained. Three-seat teak-based seating, round tables, six curved rattan dining chairs and woven pendants remain available.

## 02 Mediterranean — catalogue page 8

Original warm-ivory plaster, classic stone, oak, woven rattan, sand-greige concrete, beige linen, bronze and walnut swatches are extracted from the PDF image objects. The veined kitchen surface is cropped directly from the reference island photograph.

Furniture is rebuilt as a full linen sectional with rounded arms and a small chaise, a dark walnut drum coffee table, a substantial square-leg walnut dining table, six upholstered cane armchairs, low walnut-backed metal counter stools, a large woven dining pendant and slim bronze bar pendants. Bedrooms receive arched ivory features and suspended bronze bedside lights. Bathrooms use stone vessels, warm timber, classic stone and bronze details.

## 03 Scandi-Asian — catalogue page 10

Original warm-beige limewash, light microcement, pale stone, natural oak, oatmeal cane, oatmeal linen, black metal, fluted glass and brushed-brass swatches are extracted from the PDF.

Furniture is rebuilt as a lower oak-based oatmeal sectional, an oak drum coffee table, a softly profiled oak dining table, six curved oak wishbone chairs with woven seats, backless timber stools, a ribbed paper dining lantern and woven kitchen bell pendants. Bedrooms have an oak-and-linen headboard treatment, botanical linework and neutral bedside lamps. Bathrooms retain pale stone, warm oak and restrained brass details.

## Reference and rendering limits

`dist/assets/schemes/provenance.json` records every embedded PDF image used. The visible colour maps come from the supplied catalogue; image margins are cropped to remove the PDF's masked borders. Reference-derived normal maps and physically based material response approximate surface depth and reflectance. The PDF supplies images rather than original full-resolution PBR scans or manufacturer furniture meshes. Furniture forms and dimensions are reconstructed from the visible reference and fitted to this model; they are not claimed to be the original manufacturer assets.

## Layout review

`tools/audit-schemes.mjs` checks the two rebuilt interiors for six dining seats, valid geometry, and obstruction of the 0.9 m bedroom-entry approach. Results are saved in `docs/scheme-geometry-review.json`. Source door nodes, tracks, lighting controls and material toggles remain independent of the selected collection.
