---
id: built-in-engine
title: Built-in Container Engine
sidebar_position: 2
description: Platform architecture, prerequisites, paths, and configuration for CatBee's built-in container engine on Windows, macOS, and Linux.
---

# Built-in Container Engine

CatBee Container Studio includes a zero-cost, open-source **Built-in Container Engine** tailored for each operating system so you can run containers and Kubernetes without installing Docker Desktop.

---

## Windows: WSL 2 (Alpine Linux)

On Windows, CatBee provisions an isolated Alpine Linux **WSL 2** distribution named `catbee-container-engine`.

### How It Works

- **Engine Root**: `%LOCALAPPDATA%\CatBee\engine`
- **Virtual Disk**: `%LOCALAPPDATA%\CatBee\engine\wsl\ext4.vhdx`
- **Daemon Config**: `\\wsl.localhost\catbee-container-engine\etc\docker\daemon.json`
- **Daemon Logs**: `\\wsl.localhost\catbee-container-engine\var\log\docker\dockerd.log`
- **Host Endpoint**: `npipe:////./pipe/catbee-desktop` (relayed to `dockerd` inside WSL 2 on loopback port `23750`)
- **Automatic Windows Path Rewriting**: Requests sent through `\\.\pipe\catbee-desktop` automatically translate Windows drive bind mounts (for example, `C:\Users\me\app:/app` or volume `device=C:\data`) into WSL 2 mount paths (`/mnt/c/Users/me/app:/app`).
- **Cgroup v2 Setup**: Automatically configures cgroup controllers on start so nested containers and `kind` Kubernetes clusters work cleanly.

### Prerequisites

- Windows 10/11 with **WSL 2** installed and initialized (`wsl --status` must succeed).
- If WSL 2 is missing or incomplete, run in an elevated PowerShell and reboot:

```powershell
wsl --install --no-distribution
```

### WSL 2 Integration with Other Distros

In **Settings -> Resources -> WSL Integration**, you can expose CatBee's Docker daemon to your default WSL distribution and any additional installed WSL 2 distributions (such as Ubuntu or Debian):

- CatBee writes `/etc/profile.d/catbee-docker.sh` inside each enabled distro exporting `DOCKER_HOST=tcp://127.0.0.1:23750`.
- All WSL 2 distributions share the same loopback network namespace, so `docker` and test suites running inside Ubuntu WSL talk directly to CatBee's engine.

### Memory & CPU Limits + Resource Saver

WSL 2 shares CPU, memory, and swap globally across all WSL distributions. To cap WSL 2 memory/CPU usage, edit `%UserProfile%\.wslconfig` and run `wsl --shutdown` to apply.

CatBee also provides **Resource Saver** (**Settings -> Resources -> Advanced**) on Windows WSL 2: when enabled and no containers are running for the configured idle timeout (`30 sec` to `60 min` in 5-minute steps above 5m; default `5 min` / `300s`), CatBee flushes caches (`drop_caches` & `compact_memory`) inside the WSL VM to return unused RAM to Windows.

---

## macOS: Lima VM (`Virtualization.framework`)

On macOS, CatBee provisions an Ubuntu LTS virtual machine managed by **Lima** (`catbee` instance) running on Apple's native **Virtualization.framework (`vz`)** with **virtiofs** host directory sharing.

### How It Works

- **Engine Root**: `~/Library/Application Support/CatBee/engine`
- **Lima Home & VM Disk**: `~/.catbee/lima/catbee/` (`disk` or `diffdisk`)
- **Unix Socket**: `unix://$HOME/.catbee/lima/catbee/sock/docker.sock`
- **Daemon Logs**: `~/.catbee/lima/catbee/ha.stderr.log`
- **VPN Compatibility**: Clamps guest uplink MTU to `1350` and configures `systemd-resolved` cleanly so pulls and builds work reliably over corporate VPNs (`utun` interfaces).

### Prerequisites

- **macOS 13 (Ventura) or later**
- Hardware virtualization enabled (`kern.hv_support = 1`)

### VM Resource Allocation & Rosetta 2

In **Settings -> Resources -> Advanced**, you can tune:

- **CPUs**: `1` to your host CPU count (default: half of host cores, up to `4`; turns red with a warning above `75%` of host CPUs).
- **Memory**: `1 GB` to your host RAM (default: half of host RAM, clamped to `2`–`8 GB`; turns red with a warning above `75%` of host memory).
- **Swap**: `0` (`Off`) to `8 GB` (default: `1 GB`; warns above `4 GB`).
- **Virtual Disk Limit**: `16 GB` to `512 GB` in `8 GB` steps (default: `64 GB`; warns if set above available free disk space on your host). Virtual disks can only grow — once created, the minimum locks to your current allocation, and shrinking requires uninstalling/resetting the engine.
- **Use Rosetta for x86_64/amd64 emulation** (Apple Silicon only): Accelerates `linux/amd64` containers and builds using Apple's Rosetta 2 instead of QEMU (enabled by default on Apple Silicon).

### File Sharing (`virtiofs`)

In **Settings -> Resources -> File sharing**, configure which host directories are mounted into the macOS VM:

- By default, CatBee shares your **home directory (`~`)** and **`/var/folders`** (macOS temporary directory used by tools and Testcontainers).
- Overlapping or nonexistent paths are validated before saving, and changes restart the VM.

---

## Linux: Native Rootless Docker

On Linux, CatBee installs Docker's official static binaries and runs `dockerd-rootless.sh` via `rootlesskit` under your regular user account — **no root daemon and no virtual machine overhead**.

### How It Works

- **Engine Root**: `$XDG_DATA_HOME/catbee/engine` (defaults to `~/.local/share/catbee/engine`)
- **Binaries**: `~/.catbee/bin/` (`docker`, `dockerd`, `dockerd-rootless.sh`, `rootlesskit`, etc.)
- **Unix Socket**: `unix://$XDG_RUNTIME_DIR/catbee/docker.sock` (falls back to `~/.catbee/run/docker.sock` if `XDG_RUNTIME_DIR` is unset)
- **Daemon Config**: `~/.local/share/catbee/engine/daemon.json`
- **Daemon Logs**: `~/.local/share/catbee/engine/logs/dockerd.log`

### Prerequisites

CatBee automatically checks Linux prerequisites before installing and reports exact remediation commands if any are missing:

1. **Regular non-root user** (do not launch CatBee as `root`).
2. **`uidmap` (`newuidmap` & `newgidmap`)**:
   - Debian/Ubuntu: `sudo apt install uidmap`
   - Fedora/RHEL: `sudo dnf install shadow-utils`
3. **Subordinate UID/GID ranges** in `/etc/subuid` and `/etc/subgid` for your user:
   ```bash
   sudo usermod --add-subuids 100000-165535 --add-subgids 100000-165535 "$USER"
   ```
4. **Unprivileged user namespaces enabled**:
   ```bash
   sudo sysctl -w kernel.unprivileged_userns_clone=1
   sudo sysctl -w user.max_user_namespaces=28633
   ```
5. **`iptables`** installed (`sudo apt install iptables` / `sudo dnf install iptables`).
6. **Ubuntu 24.04+ AppArmor restriction** (`kernel.apparmor_restrict_unprivileged_userns=1`):
   If AppArmor blocks `rootlesskit`, create `/etc/apparmor.d/catbee-rootlesskit`:
   ```text
   abi <abi/4.0>,
   include <tunables/global>
   "/home/<your-user>/.catbee/bin/rootlesskit" flags=(unconfined) {
     userns,
     include if exists <local/catbee-rootlesskit>
   }
   ```
   Then reload AppArmor:
   ```bash
   sudo systemctl restart apparmor.service
   ```

:::tip File Ownership & Limits
Because containers run natively on Linux, every directory you can access can be bind-mounted directly without extra file-sharing configuration. CatBee also automatically respects your inherited `nofile` hard limit when configuring `default-ulimits` for rootless containers.
:::
