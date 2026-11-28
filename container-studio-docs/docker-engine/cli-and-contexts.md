---
id: cli-and-contexts
title: Docker CLI, Contexts & Builders
sidebar_position: 3
description: How CatBee installs the standalone Docker CLI, configures PATH, manages the catbee-desktop context, and inspects BuildKit builders.
---

# Docker CLI, Contexts & Builders

CatBee Container Studio automatically sets up a standalone **Docker CLI** on your host and keeps your active Docker CLI context synchronized with the engine running in the app.

---

## Standalone Host Docker CLI

When you install or start CatBee, it ensures the official standalone `docker` binary (currently `29.10.0`) is installed in:

```text
~/.catbee/bin/docker        (macOS / Linux)
%USERPROFILE%\.catbee\bin\docker.exe   (Windows)
```

CatBee automatically adds `~/.catbee/bin` to your shell `$PATH` without requiring administrator privileges:

- **Windows**: Prepends `%USERPROFILE%\.catbee\bin` to your **User `PATH`** environment variable, updates PowerShell profiles (`Documents\PowerShell\profile.ps1` and `Documents\WindowsPowerShell\profile.ps1`), and configures `.bashrc` / `.profile` / `.bash_profile` / `.zshrc` / `.zprofile` if present (for Git Bash / MSYS).
- **macOS**: Appends the export line to existing shell profiles (`.zshrc`, `.zprofile`, `.bashrc`, `.bash_profile`, `.profile`), or creates `~/.zshrc` if none exist.
- **Linux**: Appends the export line to existing shell profiles, or creates `~/.bashrc` if none exist.

Open a new terminal window and verify:

```bash
docker version
```

---

## The `catbee-desktop` Docker Context

When using CatBee's built-in engine, CatBee creates/updates a Docker context named **`catbee-desktop`** and activates it (`docker context use catbee-desktop`).

| Platform             | `catbee-desktop` Context Endpoint                                             |
| -------------------- | ----------------------------------------------------------------------------- |
| **Windows (WSL 2)**  | `npipe:////./pipe/catbee-desktop`                                             |
| **macOS (Lima VM)**  | `unix://$HOME/.catbee/lima/catbee/sock/docker.sock`                           |
| **Linux (Rootless)** | `unix://$XDG_RUNTIME_DIR/catbee/docker.sock` (or `~/.catbee/run/docker.sock`) |

When CatBee connects to an external engine (for example, `default` or `rancher-desktop`), it automatically releases `catbee-desktop` and switches the CLI to that external context so `docker` commands in your terminal target the same engine as the UI.

### Checking & Switching Contexts

```bash
# List all Docker contexts
docker context ls

# Manually switch to CatBee's built-in engine
docker context use catbee-desktop
```

You can also switch contexts visually in **Settings -> Docker Engine -> Builders & BuildKit**.

### Resolving `DOCKER_HOST` / `DOCKER_CONTEXT` Overrides

If a shell profile (`.zshenv`, `.zshrc`, `.bashrc`, `.profile`, `config.fish`) or process environment sets `DOCKER_HOST` or `DOCKER_CONTEXT` to a different endpoint, terminal `docker` commands will ignore `docker context use`.

CatBee automatically detects conflicting overrides and displays a warning in **Settings -> Docker Engine** pointing to the exact variable and file/line number to remove.

---

## Builders & BuildKit

In **Settings -> Docker Engine -> Builders & BuildKit**, you can:

- View the currently selected builder (`Default`) and all other available builders/contexts along with their live status (`Running`, `Stopped`, `Error`).
- Inspect **BuildKit storage limit** (`20 GB` default GC keep storage), **Used cache**, **Shared cache**, **Endpoint** (with one-click copy), and **Supported platforms** (`amd64`, `arm64`, `riscv64`, `ppc64le`, `s390x`, `arm/v7`, `arm/v6`).
- Click **Clear build cache** to prune unused BuildKit build cache and reclaim disk space.
