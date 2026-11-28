---
id: engine-modes
title: Engine Modes & Switching
sidebar_position: 1
description: Choose between CatBee Built-in Container Engine, Auto (External First), and External Engine Only modes.
---

# Engine Modes & Switching

CatBee Container Studio can run containers using its own isolated **Built-in Container Engine**, or connect to an existing **External Docker Engine** such as Docker Desktop, Rancher Desktop, Colima, OrbStack, Podman, or a native Linux Docker daemon.

You can configure the active mode in **Settings -> General -> Choose how to run Docker containers**.

---

## Available Engine Modes

### 1. CatBee Built-in Engine (`embedded`) — Recommended

Directly launches and manages CatBee's self-contained Docker engine:

- **Windows**: WSL 2 (`catbee-container-engine` Alpine Linux distribution)
- **macOS**: Lima VM (`catbee` Ubuntu LTS VM using Apple `Virtualization.framework`)
- **Linux**: Native Rootless Docker (`dockerd-rootless.sh`)

When you select **Built-in Engine**, CatBee installs (if needed) and starts the built-in engine, activates the `catbee-desktop` Docker CLI context, and enables local Kubernetes (`kind`) support.

### 2. Auto (External First) (`auto`)

The default balanced mode. At startup, CatBee resolves a Docker runtime in the following order:

1. **Active External Engine**: Checks `DOCKER_HOST` -> current Docker CLI context -> platform default socket/pipe (`\\.\pipe\docker_engine` on Windows, `/var/run/docker.sock` on macOS/Linux) -> any other reachable Docker CLI context (such as `rancher-desktop`).
2. **Installed Built-in Engine**: If no external engine is actively responding and CatBee's built-in engine is already installed, CatBee automatically starts and connects to it.
3. **Auto-Start External Desktop Runtime**: If the built-in engine is not installed, CatBee checks if Rancher Desktop or Docker Desktop is installed and attempts to start it.
4. **Built-in Engine Setup Prompt**: If no external engine is available or starts, CatBee prompts you to install the Built-in Container Engine directly from the welcome screen.

### 3. External Engine Only (`external`)

Connects strictly to an existing host Docker daemon or desktop runtime without installing or running CatBee's built-in distro or VM.

:::note Switching Modes
Changing the engine mode in **Settings -> General** prompts you to apply the change immediately (restarting or switching the active engine) or save it for the next launch.

Note that **Kubernetes (`kind`)** in CatBee requires the **CatBee Built-in Engine** to be active.
:::

---

## Switching Docker Contexts

In **Settings -> Docker Engine -> Builders & BuildKit**, you can inspect all Docker CLI contexts and switch between them:

- Click **Use CatBee engine** (or **Use as default builder** on any available builder card) to switch both CatBee Container Studio and the global Docker CLI (`docker context use`) to that engine.
- CatBee verifies the target daemon responds to `/_ping` before committing the switch.
- If a `DOCKER_HOST` or `DOCKER_CONTEXT` environment variable is exported in your shell profile (e.g. `~/.zshrc`, `~/.bashrc`, `~/.config/fish/config.fish`) or inherited by the app, CatBee displays an **Override Detected** banner in **Settings -> Docker Engine** telling you the exact file and line number so terminal `docker` commands do not silently bypass your selected context.

---

## Pausing & Stopping the Engine

From the **Engine Status Menu** in the bottom-left footer bar:

- **Pause engine / Resume engine**: Pauses all running containers (and triggers memory reclamation on supported backends) without tearing down the daemon, then unpauses only the containers paused by CatBee.
- **Restart engine**: Cleanly restarts the CatBee built-in engine.
- **Start / Stop / Reinstall / Uninstall**: Available in **Settings -> Docker Engine** and in the application **Engine** menu bar (`Start Built-in Engine`, `Stop Built-in Engine`, `Restart Built-in Engine`).

When you quit CatBee Container Studio, the **built-in engine** and any CatBee-managed Kubernetes cluster are stopped gracefully. External engines (like Docker Desktop) are left running.
