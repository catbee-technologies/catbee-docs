---
id: settings-and-troubleshooting
title: Settings, Troubleshoot & Teardown
sidebar_position: 7
description: Search settings, inspect system diagnostics, purge unused Docker data, reset defaults, and perform a clean factory reset or headless uninstall.
---

# Settings, Troubleshoot & Teardown

CatBee Container Studio features a modular **Settings** workspace (`Cmd+,` on macOS, `Ctrl+,` on Windows/Linux) with an instant keyword search bar across every setting, sub-tab, and platform option.

---

## Settings Categories

| Category             | What Is Configured                                                                                                                                                                                                                                                                                    |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **General**          | Start at login (non-Store builds), Container Quick Switcher sidebar toggle, Theme (`Sync with system`, `Day Theme`, `Night Theme`), Engine Mode (`Built-in`, `Auto`, `External`), Expose daemon on `tcp://localhost:2375`                                                                             |
| **Resources**        | **Advanced** (macOS VM CPUs/RAM/Swap/Disk/Rosetta 2, Disk image location, Windows Resource Saver), **File sharing** (macOS `virtiofs` paths), **Proxies** (Engine & Containers HTTP/HTTPS/SOCKS5 proxies), **Network** (subnet, port binding, IPv4/dual-stack), **WSL Integration** (Windows distros) |
| **Docker Engine**    | Built-in engine lifecycle (`Start`, `Stop`, `Restart`, `Reinstall`, `Uninstall`), **Builders & BuildKit** (context switching, cache usage, clear build cache), live `daemon.json` viewer                                                                                                              |
| **Kubernetes**       | Install/uninstall `kind` runtime, Enable Kubernetes, Start/Stop/Reset/Cancel cluster, Version & Node count (`1`–`8`), Show system containers                                                                                                                                                          |
| **Troubleshoot**     | Restart Engine, Clean / Purge Data, Reset to Factory Defaults, Factory Reset & Teardown                                                                                                                                                                                                               |
| **Software updates** | Check for updates, view download progress, install & restart, and read full GitHub release notes + contributor credits                                                                                                                                                                                |
| **About**            | App version, OS/arch, Electron/Node.js versions, host RAM/CPU, **Open Logs Folder**, and **Open Engine Directory**                                                                                                                                                                                    |

---

## Troubleshoot Actions

Open **Settings -> Troubleshoot** for built-in recovery and cleanup tools:

### 1. Restart Docker Engine

Cleanly restarts the CatBee built-in engine without deleting any containers, images, volumes, or settings.

### 2. Clean / Purge Data

Reclaims host disk space on the active engine by pruning:

- Stopped containers
- Dangling images
- Unused anonymous volumes
- BuildKit caches

Active containers and in-use images or volumes are preserved.

### 3. Reset to Factory Defaults

Restores all CatBee configuration, VM resource limits, proxy settings, and `daemon.json` options back to defaults while **preserving your containers, images, and volumes**. (If you are in `embedded` mode, CatBee keeps `embedded` mode active.)

---

## Factory Reset & Teardown (Clean Uninstallation)

Before uninstalling CatBee Container Studio — including **Microsoft Store uninstallation** or moving the `.app` to Trash on macOS — run **Settings -> Troubleshoot -> Factory Reset & Teardown** (or use the headless CLI flags below).

Ordinary OS uninstallation removes the desktop app package, but does **not** remove external WSL distributions, Lima VMs, or `~/.catbee` data automatically.

### What Factory Reset & Teardown Removes

1. Stops and removes the CatBee-managed Kubernetes cluster (`catbee-desktop`) and cleans its entry from `~/.kube/config`.
2. Uninstalls the CatBee built-in engine (unregisters `catbee-container-engine` WSL distro on Windows, deletes the `catbee` Lima VM on macOS, removes rootless Docker data on Linux).
3. Removes the `catbee-desktop` Docker CLI context and switches the CLI back to an active external context or `default`.
4. Removes `~/.catbee/bin` from Windows User `PATH`, PowerShell profiles, and Unix shell profiles (`.bashrc`, `.zshrc`, `.profile`, etc.).
5. Deletes `~/.catbee`, the platform engine root directory, and `~/.config/catbee`, and resets settings.

Other external Docker engines (Docker Desktop, Rancher Desktop, system `dockerd`), unrelated WSL distros, and unrelated Kubernetes clusters are **preserved**. If shutting down or unregistering the VM/WSL distro fails, engine files are not deleted so you can recover your data.

### Headless CLI Teardown (`--factory-reset` / `--uninstall`)

You can also trigger the exact same teardown flow from a terminal without opening the UI. **Close all running CatBee instances first**:

```bash
# Windows (installed path may vary for per-user vs per-machine)
"CatBee Container Studio.exe" --uninstall

# macOS
"/Applications/CatBee Container Studio.app/Contents/MacOS/CatBee Container Studio" --factory-reset

# Linux
catbee-container-studio --factory-reset
```

The command exits with a non-zero status code if teardown encounters an error, and leaves the desktop application binary itself intact so you can uninstall it afterward.

---

## Application Menu, Footer & Keyboard Shortcuts

### Window Header & Footer Controls

- **Window Header**: Switch between **Day Theme** and **Night Theme** directly from the titlebar (or access the application hamburger menu on Windows/Linux).
- **Bottom-Left Footer Bar**: Shows the live **Engine status pill** (`Running`, `Paused`, `Stopped`, or activity stage), a one-click **Pause / Resume** quick toggle button, the **Engine menu**, and (when enabled) the live **Kubernetes status pill** linking to **Settings -> Kubernetes**.
- **Bottom-Right Footer Bar**: Displays the app version pill alongside live **Software Update** status (`Update Available`, download percentage and byte progress, or `Restart to Update`).
- **Engine Menu & Quit Confirmation**: Access `Start Built-in Engine`, `Stop Built-in Engine`, and `Restart Built-in Engine` from the menu bar, with a quit confirmation prompt so running containers and background services are not stopped accidentally.

### Keyboard Shortcuts

| Context                       | Shortcut                                  | Action                                                                                                                                                                            |
| ----------------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Global**                    | `Cmd/Ctrl + ,`                            | Open **Settings** from anywhere in the app                                                                                                                                        |
| **Global**                    | `Cmd/Ctrl + Shift + 1`                    | Show or focus the CatBee Container Studio window                                                                                                                                  |
| **Global**                    | `Cmd/Ctrl + =` / `-` / `0`                | Zoom In / Zoom Out / Reset to Actual Size                                                                                                                                         |
| **Windows / Linux**           | `Alt + F4`                                | Quit CatBee Container Studio                                                                                                                                                      |
| **Lists & Logs**              | `Cmd/Ctrl + F`                            | Focus search/filter in **Containers**, **Images**, **Volumes**, **Networks**, or **Logs**                                                                                         |
| **Container Details Tabs**    | `Cmd/Ctrl + F`                            | Focus search/filter in **Logs**, **Inspect**, **Environment**, **Files** list, or open **Shell Find** (Monaco Editor retains its own `Cmd/Ctrl + F` when focused in file preview) |
| **Logs & Environment Search** | `Enter` / `Shift + Enter`                 | Jump to next / previous match                                                                                                                                                     |
| **Terminal (Shell) Find**     | `Enter` / `Shift + Enter` / `Esc`         | Next match / previous match / return focus to terminal                                                                                                                            |
| **Settings Search**           | `ArrowUp` / `ArrowDown` / `Enter` / `Esc` | Navigate search results, jump to & highlight setting, or close the search dropdown                                                                                                |

---

## Configuration Paths, Logs & Launch Flags

- **Persisted Engine Settings**:
  - **Windows**: `%LOCALAPPDATA%\CatBee\engine\settings.json`
  - **macOS / Linux**: `~/.config/catbee/engine-settings.json`
- **Application Diagnostic Logs**: Written to `catbee-container-studio.log` inside your OS Electron logs folder — open directly via **Help -> View Logs** or **Settings -> About -> Open Logs Folder**.
- **Verbose Logging (`--verbose`)**: Launch CatBee Container Studio with `--verbose` to enable verbose diagnostic logging for debugging startup, engine, or updater issues.
