---
id: installation
title: Installation & Updates
sidebar_position: 2
description: Download, install, and update CatBee Container Studio v1.x.x on Windows, macOS, and Linux.
---

# Installation & Updates

CatBee Container Studio is distributed as native installers and portable archives for **Windows**, **macOS**, and **Linux**.

Download the latest release from the [CatBee Container Studio page](/catbee-container-studio/) or [GitHub Releases](https://github.com/catbee-technologies/catbee-container-studio/releases/latest).

---

## Windows

### Available Packages

| Format                    | Artifact Pattern                                | Notes                                                                      |
| ------------------------- | ----------------------------------------------- | -------------------------------------------------------------------------- |
| **Windows x64 Installer** | `CatBee-Container-Studio-<version>-win-x64.exe` | NSIS installer with per-user or per-machine option and in-app auto-updates |
| **Windows x64 Portable**  | `CatBee-Container-Studio-<version>-win-x64.zip` | Portable archive; extract and run directly                                 |
| **Microsoft Store**       | `.msix` via Microsoft Store                     | Managed installation and automatic updates via the Microsoft Store         |

:::info Built-in Engine Prerequisites on Windows
To use the **CatBee Built-in Container Engine** on Windows, **WSL 2** must be installed and ready. If WSL 2 is not yet enabled, open PowerShell as Administrator and run:

```powershell
wsl --install --no-distribution
```

Then restart Windows before installing the built-in engine in CatBee.
:::

:::note Microsoft Store Package Notes

- In-app updates are managed directly by the **Microsoft Store**.
- **Start at login** is disabled inside the Microsoft Store sandboxed package.
- Before uninstalling the Microsoft Store app, run **Settings -> Troubleshoot -> Factory Reset & Teardown** so the WSL 2 distribution (`catbee-container-engine`) and `~/.catbee` files are cleanly removed.
  :::

---

## macOS

### Available Packages

| Format                         | Artifact Pattern                                      | Notes                                                   |
| ------------------------------ | ----------------------------------------------------- | ------------------------------------------------------- |
| **macOS Universal Disk Image** | `CatBee-Container-Studio-<version>-mac-universal.dmg` | Supports both Apple Silicon (`arm64`) and Intel (`x64`) |
| **macOS Universal Archive**    | `CatBee-Container-Studio-<version>-mac-universal.zip` | Compressed `.app` bundle                                |

### Installing from `.dmg`

1. Download `CatBee-Container-Studio-<version>-mac-universal.dmg` and open it.
2. Drag **CatBee Container Studio** into your **Applications** folder.
3. Because GitHub release builds are not notarized by Apple, macOS Gatekeeper may display a security prompt on first launch. Remove the quarantine attribute in Terminal:

```bash
xattr -d com.apple.quarantine "/Applications/CatBee Container Studio.app"
```

Alternatively, allow the app in **System Settings -> Privacy & Security**.

### Built-in Engine Prerequisites on macOS

- **macOS 13 (Ventura) or later**
- Hardware virtualization support (`sysctl -n kern.hv_support` must return `1`)
- Optional for Apple Silicon (`arm64`): **Rosetta 2** if you want accelerated `linux/amd64` container emulation (`softwareupdate --install-rosetta`)

---

## Linux

### Available Packages

| Distribution / Format        | Artifact Pattern                                          | Notes                                                          |
| ---------------------------- | --------------------------------------------------------- | -------------------------------------------------------------- |
| **Debian / Ubuntu**          | `CatBee-Container-Studio-<version>-linux-amd64.deb`       | Install via `sudo apt install ./CatBee-Container-Studio-*.deb` |
| **Fedora / RHEL / openSUSE** | `CatBee-Container-Studio-<version>-linux-x86_64.rpm`      | Install via `sudo dnf install ./CatBee-Container-Studio-*.rpm` |
| **Universal AppImage**       | `CatBee-Container-Studio-<version>-linux-x86_64.AppImage` | Supports in-app auto-updates                                   |
| **Tarball Archive**          | `CatBee-Container-Studio-<version>-linux-x64.tar.gz`      | Extract and run the binary                                     |

For AppImage builds, make the file executable before launching:

```bash
chmod +x CatBee-Container-Studio-*.AppImage
./CatBee-Container-Studio-*.AppImage
```

:::info Built-in Engine Prerequisites on Linux
CatBee's built-in engine on Linux runs **native rootless Docker** under your regular user account (do not run CatBee as `root`). See [Built-in Container Engine -> Linux](./docker-engine/built-in-engine#linux-native-rootless-docker) for `uidmap`, `subuid`/`subgid`, `iptables`, and Ubuntu AppArmor setup.
:::

---

## Software Updates

Open **Settings -> Software updates** (or click the version badge in the bottom-right status bar) to check for updates and read release highlights directly from GitHub.

### Update Behavior by Platform

- **Windows Installer (`.exe`) & Linux (`.AppImage`, `.deb`, `.rpm`)**: Supports one-click **Download Update** and **Restart Now**. Before restarting to install, CatBee gracefully shuts down the built-in engine and any running Kubernetes cluster, then relaunches into the updated version (skipping the Windows setup wizard on in-app updates).
- **Windows Microsoft Store**: Displays a button to open the Microsoft Store page to install the update.
- **macOS**: Displays the new release notes and links to GitHub Releases. Download the latest `.dmg`, replace the app in `/Applications`, and re-run `xattr -d com.apple.quarantine "/Applications/CatBee Container Studio.app"` if prompted.
- **Windows Portable `.zip` & Linux `.tar.gz`**: Download the latest archive and replace the extracted folder.

### Release Channels

CatBee automatically matches your installed channel:

- **Stable builds** (e.g., `1.x.x`) check against the latest stable GitHub release.
- **Pre-release builds** (versions with a suffix such as `-alpha` or `-beta`) check against pre-release tags as well.
