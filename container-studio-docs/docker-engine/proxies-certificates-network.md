---
id: proxies-certificates-network
title: Proxies, Certificates & Networking
sidebar_position: 4
description: Configure HTTP/HTTPS proxies, corporate Root CA & registry TLS certificates, Docker subnet, port binding, IPv6, and daemon.json.
---

# Proxies, Certificates & Networking

CatBee Container Studio manages proxy settings, corporate CA certificates, and daemon networking for its built-in engine, and renders the resulting `daemon.json` directly in **Settings -> Docker Engine**.

---

## Proxies

Open **Settings -> Resources -> Proxies** to configure proxy behavior independently for the engine/app and for containers.

### Engine Proxy

Controls how the CatBee desktop app downloads engine/Kubernetes artifacts and how `dockerd` pulls/pushes container images:

- **System proxy** (default): Automatically detects OS proxy settings.
- **No proxy**: Direct connections without a proxy.
- **Manual configuration**: Specify custom `HTTP Proxy`, `HTTPS Proxy` (`http://`, `https://`, `socks5://`, or `socks5h://` URLs), and `Bypass proxy (no_proxy)` rules (default bypass: `localhost,127.0.0.1,docker.internal`).

### Containers Proxy

Controls `HTTP_PROXY` / `HTTPS_PROXY` / `NO_PROXY` environment variables injected into containers created by CatBee and into `docker run` / `docker build` commands targeting the `catbee-desktop` context (written into `~/.docker/config.json` under `proxies` keyed by endpoint):

- **Same as host proxy** (default): Mirrors the Engine proxy setting.
- **System proxy**: Uses the OS-detected proxy.
- **No proxy**: Disables proxy injection for containers.
- **Manual configuration**: Separate `HTTP`, `HTTPS` (`http://`, `https://`, `socks5://`, or `socks5h://`), and `no_proxy` values for containers.

Environment variables you explicitly define on a container always take precedence over the default container proxy.

---

## Corporate Root CA & Registry Certificate Sync

Behind corporate TLS-inspecting proxies or private registries, CatBee automatically synchronizes trusted certificates into the built-in engine on startup:

- **Windows (WSL 2)**: Exports validated, non-revoked Root CA certificates from `Cert:\LocalMachine\Root` and `Cert:\CurrentUser\Root` (excluding `Disallowed` stores) into Alpine's trust store (`/usr/local/share/ca-certificates` + `update-ca-certificates`).
- **macOS (Lima VM)**: Exports trusted Root CA certificates verified via `/usr/bin/security verify-cert` into the Ubuntu guest trust store.
- **Docker Registry Certificates (`~/.docker/certs.d`)**: Automatically mirrors custom registry certificates from `~/.docker/certs.d` (`%USERPROFILE%\.docker\certs.d` on Windows) into `/etc/docker/certs.d` inside the built-in engine, restarting `dockerd` only when certificates change.

---

## Networking

Open **Settings -> Resources -> Network** to configure the built-in engine's networking:

| Setting                     | Default            | Description                                                                                                                                  |
| --------------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Docker subnet**           | `192.168.65.0/24`  | CIDR for the default bridge network (`docker0` / `bip` in `daemon.json`). Supports `/8` to `/30`.                                            |
| **Port binding behavior**   | `open` (`0.0.0.0`) | `open` exposes published ports on all interfaces; `localhost` binds published ports to `127.0.0.1` only (`ip: "127.0.0.1"`).                 |
| **Default networking mode** | `ipv4`             | Choose `ipv4` or `dualstack` (enables IPv6 with `fd00:cb::/64` ULA subnet on WSL 2 and Lima; `ip6tables` is omitted in Linux rootless mode). |

---

## Daemon Configuration (`daemon.json`)

CatBee generates `daemon.json` automatically from your settings with production-friendly defaults:

- **BuildKit enabled** with automatic GC (`defaultKeepStorage: "20GB"`).
- **JSON log rotation** (`max-size: "10m"`, `max-file: "3"`) so container logs do not fill your disk unbounded.
- **Raised open-file limits (`nofile`)**: Soft `82920`, Hard `524288` (or clamped to the inherited hard limit on Linux rootless).

Inspect the live generated configuration anytime under **Settings -> Docker Engine -> Daemon Configuration (daemon.json)**.

---

## Expose Daemon on TCP (`tcp://localhost:2375`)

In **Settings -> General**, you can enable **Expose daemon on `tcp://localhost:2375` without TLS** for the CatBee built-in engine.

:::warning Local Security Notice
The TCP relay binds strictly to `127.0.0.1:2375`, but **any local process on your machine** can connect to Docker without TLS authentication while this option is enabled. Prefer socket/named-pipe connections when possible and only enable TCP when legacy tools require it.
:::
