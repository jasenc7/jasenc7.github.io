---
title: pyr
outline: deep
---

# pyr

Python without the ceremony.

A project manager that bootstraps its own runtime, manages your venv, and gets out of the way. Six commands. One honest lockfile. No Python required to install.

The thing that manages Python shouldn't be Python. Poetry tried and became the problem it claimed to solve. uv solved it with Rust - then sold to OpenAI. pyr is a single compiled binary. It drives pip and a standalone CPython runtime; it doesn't depend on them to install itself.

```
curl -fsSL https://pyrun.dev/install.sh | sh
```

## Commands

`init` `run` `add` `remove` `sync` `upgrade` - that's the whole API. No activate, no pip freeze, no requirements hell.

## How it works

`pyproject.toml` is the source of truth. `requirements.txt` is a generated lock - flat, pinned, readable. Edit either; pyr reconciles on the next run.

Hand-edit your deps, run your code, sync happens silently. Upgrade the managed Python, venvs rebuild themselves. Stale state is not your problem.

## Links

- [pyrun.dev](https://pyrun.dev)
- [GitHub](https://github.com/jasenc7/pyr)
