---
title: "I built a Python project manager in one night"
date: 2026-04-14
---

# I built a Python project manager in one night

On March 19, OpenAI announced it was acquiring Astral - the company behind uv, Ruff, and ty. Three tools that had quietly become load-bearing infrastructure for modern Python development. The Astral team joins Codex. The tools stay MIT-licensed. The roadmap now serves OpenAI.

I didn't build pyr because of the acquisition. I built it the night of April 13 because the problem has been bothering me for years and I finally had the leverage to do something about it. But the acquisition is why it matters.

## The problem

The thing that manages Python shouldn't be Python.

This sounds obvious when you say it out loud, but the Python ecosystem has been living with this contradiction for a decade. Poetry is written in Python. To install Poetry, you need Python. To manage Python versions, you need pyenv, which is a collection of shell scripts that download and compile CPython from source. The ceremony required to get from zero to a running Python project is genuinely embarrassing compared to every other modern language ecosystem.

uv fixed this. A single Rust binary. No Python prerequisite. Fast. It was the right tool and it earned its adoption honestly. And now it belongs to OpenAI.

## What I built

pyr is a project manager that bootstraps its own runtime. One binary. Six commands. No Python required to install.

```
curl -fsSL https://pyrun.dev/install.sh | sh
pyr init myapp
cd myapp
pyr run
```

That's a working Python project. pyr downloaded a standalone CPython on first use, created a venv, scaffolded the project, and ran it. No brew, no apt, no pyenv.

`pyproject.toml` is the source of truth. `requirements.txt` is a generated lockfile - flat, pinned, readable. Hand-edit your deps, run your code, and pyr reconciles silently. Upgrade the managed Python and venvs rebuild themselves across every project. Stale state is not your problem.

The whole API is `init`, `run`, `add`, `remove`, `sync`, `upgrade`. I didn't add more commands because there aren't more problems to solve.

## How

I built it in TypeScript, compiled to native binaries with `deno compile`. One session. One night.

I used Claude Code as a co-pilot. I'm going to be direct about that because I think the instinct to hide it is wrong. The architecture - the decisions about what to delegate to pip vs what to own, the surgical TOML editing that preserves your file byte-for-byte instead of round-tripping through a serializer, the venv version stamping that triggers automatic rebuilds - that's judgment. The LLM is leverage on the implementation. The same way a compiler is leverage on machine code.

The output is a cross-platform CLI with CI/CD that builds and smoke-tests on macOS, Linux, and Windows, a marketing site, a GitHub release pipeline, and documentation. From one person. In one night.

I'm not saying this to brag. I'm saying it because the economics of what one engineer can ship have changed and most people haven't caught up to that yet.

## Why it matters now

uv is still open source. uv still works. But the roadmap now serves Codex, and the community knows it. Features that benefit OpenAI's coding agent rise to the top of the backlog. Features the broader Python community wants but that don't serve Codex go to the back of the line. That's not paranoia. That's how platform capture works. You don't close the source code. You shift who the roadmap serves.

pyr is not faster than uv. It delegates resolution to pip; uv has a custom Rust resolver that's genuinely impressive. pyr is not trying to be uv.

pyr is independent. No funding. No investors. No acquirer to answer to. The tool exists because the problem exists, and the only thing on the roadmap is solving the problem better.

If that matters to you, it's at [pyrun.dev](https://pyrun.dev).
