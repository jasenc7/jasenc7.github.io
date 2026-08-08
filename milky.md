---
title: "Milky: a night sky forecast with nothing behind it"
date: 2026-08-08
---

# Milky: a night sky forecast with nothing behind it

I wanted an app that answers one question: is tonight worth going outside?

Not a weather report. Not a ten-panel dashboard. A number, a sentence, and a reason. Clear skies are only half of it — a full moon washes out the Milky Way about as thoroughly as cloud does, and nothing that shows you a cloud percentage tells you that.

So I built [Milky](https://jasencarroll.com/milky/). It gives you a 0–10 score for tonight at your location, a sentence explaining it, a seven-night outlook, and a live global aurora map.

It has no backend. Not "a small backend." None.

## Why no backend

Both data sources are public, free, keyless, and CORS-friendly:

- **Open-Meteo** for cloud cover by layer, visibility, dew point, and precipitation probability.
- **NOAA SWPC** for the real-time Kp index and the Ovation Prime aurora model.

Neither needs an API key, which means there's no secret to protect, which means there's nothing a server would be for. The browser calls both directly. The build is static, deployed to GitHub Pages by a GitHub Actions job, and it costs zero dollars a month.

I priced the alternatives honestly before choosing. A free-tier container host is $0 but cold-starts and sleeps, so you'd pay ~$7/month to remove latency you only introduced by adding a server. A small VPS is $5–6/month and you hand-roll TLS, CDN, and deploys for no benefit. Static hosting was both the cheapest option and the correct one, which doesn't happen often enough to pass up.

The whole thing is Deno, Preact via Vite, and Leaflet for the map. Preact over React was a 45 kb → 3 kb bundle decision, and bundle size matters when the thing installs to a phone home screen and has to work offline.

## The score

```
score = 10
      − cloudPenalty(total, low)
      − moonPenalty(fullness, isUp)
      − humidityPenalty(dewPoint, temp)
      − precipPenalty(probability)
```

Clamped to 0–10, one decimal. Low cloud carries extra weight on top of total cloud, because thin high cirrus still lets the band through and a low deck does not. The moon penalty only applies when the moon is actually above the horizon — a full moon that already set costs you nothing, and treating phase alone as the input would have been wrong on exactly the nights you care about.

One detail I'd defend in a review: penalty inputs are averaged across the night's hours *first*, then penalized once. Penalizing hour by hour and averaging the scores gives a different answer, and a worse one — it lets one clear hour in an overcast night look like a real window.

Two things it does not do, stated plainly because the app doesn't hide them either. There's no light pollution term — a Bortle-scale input was scoped and cut, so the score is weather and moon only, and it will happily tell you it's a 9 in the middle of a city. And air temperature isn't fetched, so the humidity penalty approximates it as dew point + 8 °C to estimate relative humidity. That's a defensible nighttime spread and it's still an approximation standing in for a measurement.

## The moon data that didn't exist

The original design said: get moon phase and moonrise/moonset from Open-Meteo's `daily` block, alongside sunrise and sunset.

Open-Meteo has no lunar variables. Zero. Not deprecated, not on another endpoint — the API has never had them. The spec was written from an assumption about what a weather API surely provides, and it typechecked fine as prose.

The fix is `suncalc`, four kilobytes and no dependencies, computing phase and rise/set client-side. That's arguably better than the original plan: because it also gives altitude, `moonPresent` reflects the moon actually being up rather than a flag inferred from the clock.

Two traps came with it.

**The conventions disagree.** Astronomy encodes lunation as 0…1 where 0.5 is full. My scoring engine wants fullness where 1 is full. Both are 0-to-1 floats, so passing the wrong one is invisible — no type error, no crash, just a score that treats a full moon as a new one and vice versa. The remap `1 − |phase − 0.5| × 2` lives in the moon module, not the engine, so there's exactly one place where the translation happens and the engine keeps its own convention.

**suncalc is a UMD module.** It must be imported as a default import. A named import typechecks cleanly against `@types/suncalc` and crashes at runtime under Deno's CJS interop. That's a comment in the source now, because it looks like a style preference and isn't.

## What I tested and why

Seven test files, 44 tests, green in CI on every push.

The engine/service split exists to make this cheap: everything in `engine/` is pure computation with no I/O, so tests are inputs and assertions with no mocking framework anywhere. Each service exports its `parse()` separately from its fetch, so response shapes get tested as inline fixtures. Error paths monkeypatch `globalThis.fetch` inside `try/finally`, so a failing assertion can't leak a broken fetch into the next test.

Two choices worth naming:

**Real ephemeris over mocked ephemeris.** Moon tests assert against suncalc's actual output for known full and new moons. suncalc is deterministic, so this is stable — and it catches the convention remap bug above, which a mock would have cheerfully confirmed as correct.

**Build-artifact tests instead of E2E.** Rather than stand up Playwright to prove the PWA installs, one test suite asserts on `dist/`: the base path, the service worker, the manifest's icon entries, the icon files, the apple-touch-icon link. It runs in a second on every push. The parts that genuinely need a phone — Add to Home Screen, offline reload, Lighthouse — stay manual and documented as manual, which is more honest than an E2E suite that quietly tests none of it.

I also mutated a threshold (`>= 8` → `> 8`) and confirmed exactly one boundary test failed. A test suite that stays green when you break the code is decoration.

---

Milky is at [jasencarroll.com/milky](https://jasencarroll.com/milky/). The follow-up post is about the aurora map, which was by far the hardest part and is not hard for the reason you'd expect: [the aurora map is two rectangles](/aurora-map-projection).
