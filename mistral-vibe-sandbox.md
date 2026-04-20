---
title: "I sandboxed Mistral's Vibe in an afternoon"
date: 2026-04-20
---

# I sandboxed Mistral's Vibe in an afternoon

I caught a live security bug before I even opened a terminal.

Perplexity ships a desktop app called Computer. It has toggles for filesystem access, Mail, Notes, GitHub. I turned filesystem off. The AI kept reading my files. I restarted the app. Still reading. I watched it list the contents of `~/dev/chat-responses-proxy` in real time with the toggle disabled, while the diagnostic showed `pplx_device__filesystem` still connected.

The toggle was cosmetic. The daemon held the session regardless of what the UI said.

This is the state of agentic desktop software in April 2026. The toggle is not the gate. The gate is somewhere else, or there is no gate.

## The actual problem

Mistral Vibe is a good coding agent. It's open source, model-agnostic, and ships with a configuration system that's genuinely thoughtful. I was already using it. But after watching Perplexity Computer escape its own sandbox in real time, I wanted to understand exactly what Vibe could touch on my machine - and I wanted enforcement at a layer the software itself couldn't override.

Vibe's `config.toml` gives you tool-level permissions. You can denylist paths, restrict bash to an allowlist, gate `web_fetch` behind a prompt. That's all enforced by Vibe's runtime. If Vibe has a bug - the exact category of bug I'd just watched - those denylists become suggestions.

I needed kernel-level enforcement. Something that applies before Vibe's Python process starts and holds regardless of what happens inside it.

## The stack

**nono** is a sandbox tool for AI coding agents. On macOS it uses `sandbox-exec` - the same Seatbelt primitive Claude Code's built-in sandbox used - to apply a filesystem policy before the process starts. Once the Seatbelt profile is applied, there's no runtime flag to disable it. The policy is the policy.

I wrapped Vibe in a zsh function:

```zsh
function vibe() {
  local project_dir="${PWD}"
  env PATH="/Users/jasen/.nix-profile/bin:..." \
  nono run \
    --write "${project_dir}" \
    --write /Users/jasen/.vibe/logs \
    --read /Users/jasen/.local/share/uv \
    --read /Users/jasen/.vibe \
    --read /Users/jasen/dev/dotfiles/.vibe \
    --read /Users/jasen/.nix-profile \
    --allow-cwd \
    -- /Users/jasen/.local/bin/vibe "$@"
}
```

Now typing `vibe` from any project directory launches Vibe inside a kernel-enforced sandbox scoped to that directory. All normal Vibe flags pass through. The sandbox output tells you exactly what it can touch before the session starts.

The Vibe binary lives in a `uv`-managed Python virtualenv at `~/.local/share/uv/tools/mistral-vibe`. That path needs to be explicitly granted as read-only so the interpreter can execute. Everything else - your home directory, SSH keys, documents, other projects - is inaccessible by default.

**nono doesn't solve network.** Its network control on macOS is binary: allow or block entirely. Since Vibe needs to reach package registries - `pip`, `npm`, `jsr` - blocking everything wasn't an option. The fix is **LuLu**, an open-source macOS firewall from Objective-See. An allowlist of known-good registries (`pypi.org`, `registry.npmjs.org`, `jsr.io`, `api.mistral.ai`) plus a catch-all block rule on the Python and Node processes. Anything the agent tries to reach that isn't on the list gets blocked without a prompt.

**The `config.toml`** still matters. nono and LuLu enforce the outer boundary. The config handles tool-level policy inside the sandbox: which bash commands are allowed, which paths can be written, which tools require a prompt. The two layers are complementary. If nono has a gap, the config catches it. If the config has a gap, nono catches it.

## The debugging

Getting nono to actually launch Vibe took about an hour of reading tracebacks. The failures were informative.

Exit code 127 meant the Python interpreter wasn't accessible. Vibe's binary is a Python script with a shebang pointing at `~/.local/share/uv/tools/mistral-vibe/bin/python3`. That path wasn't in the sandbox. Add `--read /Users/jasen/.local/share/uv`.

`PermissionError: [Errno 1] Operation not permitted: '/Users/jasen/.vibe/trusted_folders.toml'` meant Vibe's startup sequence was trying to stat its config directory. Add `--read /Users/jasen/.vibe`.

`file-read-metadata /Users/jasen/dev/dotfiles/.vibe/config.toml` in the diagnostic was the symlink problem. I'd made `~/.vibe/config.toml` a symlink into my dotfiles repo. nono allowed reads to `~/.vibe` but not the symlink target. Add `--read /Users/jasen/dev/dotfiles/.vibe`.

`nono learn` - which is supposed to trace a live run and discover required paths - returned "No additional paths needed" every time. This is a known bug on macOS: `fs_usage` only captures successful reads, not denied ones. The tool is only useful for profiling working runs, not diagnosing failing ones. I debugged by reading tracebacks.

## The config audit

While I had the config open, I audited it properly. The main gap was `read_file` having no denylist. Writes to `~/.ssh` were blocked. Reads weren't. An agent that can `read_file` on `~/.ssh/id_rsa` and then use `web_fetch` to POST it somewhere is a problem, even with `web_fetch` gated behind a prompt. Adding a denylist to `read_file` covering `~/.ssh`, `~/.aws`, `~/.gnupg`, and `Library` closed it.

`grep` was `permission = "always"` with no denylist. Same issue. Grep scanning your keychain directory silently is an exfil path. Changed to `permission = "ask"` or add the same sensitive path denylist.

`enable_auto_update = true` and `enable_telemetry = true` were the other two. Auto-update means you're trusting every release without review. For a tool with filesystem access, that's a supply chain decision worth making explicitly. I turned both off.

## The dotfiles

All of this is now in a private repo at `github.com/jasenc7/dotfiles`. The config is symlinked from `~/.vibe/config.toml` to `dotfiles/.vibe/config.toml`. The zsh function lives in `dotfiles/zsh/vibe.zsh` and is sourced from `.zshrc`. Changes to either are tracked, versioned, and portable.

The repo has a `.gitignore` that explicitly excludes `.vibe/logs/`, `.env` files, and key material. The `config.toml` contains `api_base` URLs and provider structure but no credentials - those stay in the environment.

## What I learned

The Perplexity Computer bug was real and reproducible. I didn't find it by auditing - I found it by using the product and noticing something that shouldn't have worked. The toggle not being the gate is a product decision that someone made consciously, probably because it made the demo better. The daemon holding the session through a UI restart is a different kind of failure - either a bug or a feature depending on whose interests you're weighing.

The right response to "AI tools are shipping with inadequate sandboxing" is not to stop using them. It's to enforce the sandbox yourself at a layer the software can't override. The tooling to do this exists, it's not complicated, and it takes an afternoon.

Most people haven't done it. That's the actual problem.

***

The tooling to do this exists, it's not complicated, and it takes an afternoon.

Most people haven't done it. That's the actual problem.

*nono is at [github.com/always-further/nono](https://github.com/always-further/nono). LuLu is at [objective-see.org](https://objective-see.org/products/lulu.html).*

*P.S. If you want to use Mistral Vibe with a Responses proxy: [github.com/jasenc7/chat-responses-proxy](https://github.com/jasenc7/chat-responses-proxy)*

***
