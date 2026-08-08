---
title: "The aurora map is two rectangles"
date: 2026-08-08
---

# The aurora map is two rectangles

The aurora layer in [Milky](/milky) was the part I expected to be easy. Fetch a grid of aurora probability from NOAA, paint it green, put it on a map. It's an overlay.

It took longer than the entire forecast engine, and none of the time went where I thought it would.

## The data

NOAA SWPC publishes the Ovation Prime model as a single JSON file, refreshed every few minutes:

```
GET https://services.swpc.noaa.gov/json/ovation_aurora_latest.json
```

Inside is a 360×181 grid — one point per degree of longitude, one per degree of latitude — as `[lon, lat, power]` triples. Longitude arrives as 0…359 and has to be remapped to −180…179 to match the world every map library thinks in. That's the easy part, and it's the part that has a test.

## The projection

The grid is equirectangular: one row per degree of latitude, every row the same height. Leaflet renders Web Mercator, where a degree of latitude gets taller the further you are from the equator.

Paint one canvas row per grid row and the whole thing is wrong. Not subtly — Mercator stretches the poles, so an unresampled overlay drags the aurora ovals down toward the equator by hundreds of miles. It renders. It looks plausible. It's a picture of aurora happening somewhere it isn't.

The fix is to iterate over the *destination* rows instead of the source rows:

```ts
for (let y = 0; y < CANVAS_HEIGHT; y++) {
  // Where does Mercator actually put this pixel row?
  const lat = mercatorYToLat((y + 0.5) / CANVAS_HEIGHT);
  // Nearest source row for that latitude.
  const latIdx = clamp(Math.round(lat + 90), 0, GRID_HEIGHT - 1);
  // Copy its 360 columns across.
  ...
}
```

For each output row, invert Mercator to get the latitude that belongs there, find the nearest grid row, copy it. 200 rows × 360 columns through a single `ImageData` write, comfortably under 100 ms, and the fetch dominates the budget anyway.

Sampling at pixel centers (`y + 0.5`) rather than edges is a half-pixel correction that matters more than it sounds when each row is a full degree of latitude near the pole.

## Why two maps instead of one

Here's the part I didn't anticipate.

Aurora lives poleward of about 45°. A Web Mercator world map spends most of its pixels on an equator where nothing is ever happening, and then you get to choose your failure:

- Frame the whole world and Antarctica inflates to the size of Africa, dwarfing the southern oval you were trying to show.
- Frame tightly enough to fill the viewport and you crop the ovals.
- Split the difference and you get letterboxed gutters on a map that's supposed to feel live.

So: two maps. One band from 30° to the Mercator limit (85.05°) for the northern hemisphere, one mirrored for the southern. The ±30° cut keeps even an extreme storm in frame — Kp 9 aurora reaches roughly 40° — and running to the Mercator limit means the ovals never clip. Each band is naturally a wide ~2.4:1 rectangle with almost no dead space. Both share one painted overlay image; Leaflet clips it to each band's view.

## The bug that stopped happening

The detail I'm actually pleased with is one line:

```ts
const aspect = (2 * Math.PI) / (mercY(band.north) - mercY(band.south));
```

The container's CSS `aspect-ratio` is derived from the band's *projected* bounds rather than hardcoded. Frame and content are therefore the same shape, always, at any viewport width.

That started as a tidiness thing and turned out to fix a class of bugs. When a map's frame and its `maxBounds` are different shapes, `fitBounds` can only satisfy one axis, and the camera can wedge itself into a corner where the bounds clamp fights the zoom floor and panning goes sticky. When the shapes match, the fit is always exactly satisfiable and the whole failure mode is gone — not handled, not clamped, gone. `zoomSnap: 0` finishes it, since any zoom snapping would reintroduce a sliver of gutter or crop.

I didn't fix those bugs. I stopped generating them, which is cheaper and much easier to keep true.

One more thing that only shows up in a real browser: the zoom floor has to be recomputed by a `ResizeObserver` on the *element*, not a window resize listener. The page column is 72 characters of a web font that loads late, so the container changes size after first paint without the window ever resizing. Watch the window and the map is framed correctly right up until the font arrives.

## The projection I didn't use

The correct way to draw aurora is a polar azimuthal plot, looking straight down at the pole. It's what NOAA itself publishes. The ovals are rings, and rings are what they actually are.

I rejected it, and the reason is boring: no stock tile provider serves it. Choosing it means proj4, custom coastline rendering, and owning a basemap — a meaningful project on its own, sitting behind a feature that was already working in Mercator. It's on the list as a future enhancement, which is where things go when they're a better idea than the schedule allows.

The version I shipped is two rectangles and a resample. It's the least clever solution I could find that's actually right, and the fastest way to see whether the thing is worth looking at is to go outside on a night when it says 8.

Milky is at [jasencarroll.com/milky](https://jasencarroll.com/milky/).
