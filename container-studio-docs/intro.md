---
id: intro
title: Introduction
slug: /
sidebar_position: 1
description: Official documentation for CatBee Container Studio v1.x.x — desktop control room for Docker, built-in container engines, Docker CLI, and Kubernetes.
---

# CatBee Container Studio

**CatBee Container Studio** (`v1.x.x`) is a free, open-source, cross-platform desktop application for running, inspecting, and managing Docker containers, images, volumes, networks, logs, files, and local Kubernetes clusters — without requiring Docker Desktop.

Built with **Electron, TypeScript, Angular, and Dockerode**, Container Studio pairs a responsive native interface with an optional **Built-in Container Engine** for Windows, macOS, and Linux, alongside seamless support for external Docker engines.

---

## Key Highlights in v1.x.x

- **Built-in Container Engine (No Docker Desktop Required)**:
  - **Windows**: Isolated Alpine Linux WSL 2 distribution (`catbee-container-engine`) with a Windows named pipe relay (`\\.\pipe\catbee-desktop`), automatic Windows-to-WSL bind-mount path rewriting, and Resource Saver idle memory reclamation.
  - **macOS**: Lima-managed Ubuntu VM powered by Apple `Virtualization.framework` (`vz`) and `virtiofs` file sharing, configurable CPU/RAM/Swap/Disk sliders, Apple Silicon Rosetta 2 acceleration, and VPN-friendly MTU clamping.
  - **Linux**: Native rootless Docker Engine (`rootlesskit`) with zero VM overhead, automatic `nofile` ulimit configuration, and AppArmor diagnostics.
- **Built-in Local Kubernetes (`kind`)**:
  - Provision single-node or multi-node (1–8 nodes) local Kubernetes clusters directly on the CatBee built-in engine, complete with `LoadBalancer` support via `cloud-provider-kind` and automatic `kubectl` context configuration.
- **Bundled Docker CLI & Context Management**:
  - Automatically installs the standalone `docker` CLI into `~/.catbee/bin`, configures your shell `$PATH`, manages the `catbee-desktop` Docker context, and integrates cleanly with external Docker tools and SDKs.
- **Complete Container & Compose Lifecycle**:
  - Automatic Docker Compose project grouping with aggregate CPU, memory, Disk I/O, and Network I/O metrics, coordinated group actions, and Compose-aware or Engine-based **Force Recreate** with rollback protection.
- **In-App Files Browser, Monaco Editor & PTY Terminal**:
  - Browse and edit files directly inside running containers and persistent Docker volumes using the integrated **Monaco Editor**, or open an interactive **xterm.js** shell with terminal search and auto-reconnect.
- **Unified Global Logs & Real-Time Telemetry**:
  - Stream live CPU, memory, network, and block I/O charts per container, and aggregate logs across all active containers with regex, case-sensitive, and whole-word search.
- **Enterprise Proxies, Certificates & Clean Teardown**:
  - Configure Engine and Container proxies, sync trusted Windows/macOS corporate Root CA certificates and `~/.docker/certs.d` registry certificates, inspect `daemon.json` and BuildKit builders, and perform a clean **Factory Reset & Teardown** from Settings or via CLI (`--factory-reset` / `--uninstall`).

---

## Architecture Overview

CatBee Container Studio separates the user interface from system and daemon operations using a layered Electron architecture:

```text
┌──────────────────────────────────────────────────────────┐
│                 Angular Renderer (UI)                    │
│  Containers │ Images │ Volumes │ Networks │ Logs │ Settings
└───────────────────────────┬──────────────────────────────┘
                            │ Electron IPC (Context Bridge)
┌───────────────────────────▼──────────────────────────────┐
│                  Electron Main Process                   │
│  EngineManager │ K8sManager │ ContextManager │ AutoUpdater
└───────────────┬───────────────────────────┬──────────────┘
                │ Dockerode                 │ Platform Drivers
┌───────────────▼───────────────┐ ┌─────────▼──────────────┐
│   External Docker Daemon      │ │ CatBee Built-in Engine │
│ (Docker Desktop / Rancher /   │ │ WSL 2 │ Lima │ Rootless│
│  Colima / Podman / Socket)    │ │    + kind Kubernetes   │
└───────────────────────────────┘ └────────────────────────┘
```

All communication happens directly over local sockets or named pipes on your machine — no cloud proxies, no required accounts, and zero telemetry tracking.

---

## Documentation Guide

| Guide                                                                              | What You Will Learn                                                         |
| ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| [Installation & Updates](./installation)                                           | Supported platforms, installers, macOS Gatekeeper notes, and in-app updates |
| [Engine Modes & Switching](./docker-engine/engine-modes)                           | Embedded, Auto (External First), and External Only runtime discovery        |
| [Built-in Container Engine](./docker-engine/built-in-engine)                       | Windows WSL 2, macOS Lima VM, Linux Rootless setup, and prerequisites       |
| [Docker CLI, Contexts & Builders](./docker-engine/cli-and-contexts)                | `~/.catbee/bin/docker`, `catbee-desktop` context, and BuildKit cache        |
| [Proxies, Certificates & Networking](./docker-engine/proxies-certificates-network) | HTTP/HTTPS/SOCKS5 proxies, corporate Root CAs, subnets, and `daemon.json`   |
| [Testcontainers Setup](./testcontainers)                                           | Configuring Testcontainers (Java, Node, Go, Python, .NET) with CatBee       |
| [Local Kubernetes (kind)](./kubernetes)                                            | Installing `kind`, multi-node clusters, `kubectl`, and `LoadBalancer`       |
| [Containers & Compose](./features/containers)                                      | Fleet dashboard, logs, terminal, Monaco files, env/mounts/ports editing     |
| [Images, Volumes & Networks](./features/images-volumes-networks)                   | Visual launcher, layer inspector, volume file editor, and IPAM topologies   |
| [Global Logs Hub](./features/global-logs)                                          | Multi-container log streaming and regex filtering                           |
| [Settings, Troubleshoot & Teardown](./settings-and-troubleshooting)                | Settings search, purge data, factory reset, and headless `--uninstall`      |
| [Development & Contributing](./development)                                        | Local dev setup, Vitest suite, linting, and packaging                       |
