---
id: images-volumes-networks
title: Images, Volumes & Networks
sidebar_position: 2
description: Pull and inspect Docker images, launch containers visually, edit volume files directly with Monaco Editor, and inspect network IPAM topologies.
---

# Images, Volumes & Networks

---

## Images

The **Images** view catalogs all local Docker images with repository names, tags, copyable IDs, virtual disk sizes, and relative ages.

- **Segmented Filters**: Switch between **All**, **Used**, **Unused**, and **Dangling** images.
- **Customizable Columns & Search**: Focus search with `Ctrl/Cmd + F`, toggle visible table columns, and resize column widths with persistent layout preferences.
- **Pull Image**: Pull images from Docker Hub or private registries (press `Enter` to submit).
- **Deep Layer & Metadata Inspector**: Inspect layer-by-layer build history commands and sizes, OS/Arch, `ENTRYPOINT`, `CMD`, environment defaults, and a **Containers Using This Image** tab to audit dependencies before deleting.
- **Cleanup**: Delete individual images, bulk delete selected images, or **Prune Dangling** images safely.

### Visual Container Launcher (`Run Container`)

Click **Run** on any image to launch a container without writing CLI flags:

- Optional custom **Container Name**
- **Port Mappings**: Map host ports to container ports (enter `0` for a random host port, or leave blank to keep unpublished) with live duplicate-binding and range validation
- **Volume Mappings**: Bind host directories (with native folder picker) or named volumes with read-only (`ro`) toggle
- **Environment Variables**: Key-value editor with direct `.env` file paste support
- **Draft Protection**: Prompts for confirmation before discarding unsaved drafts

---

## Volumes

The **Volumes** view manages persistent storage across your engine:

- **Create Named Volumes**: Specify a volume name, driver, and optional host directory path.
- **Fleet Size & Filtering**: View total volume footprint and filter by **All**, **In Use**, or **Unused**, or reclaim space with **Prune Unused**.
- **Customizable Columns & Search**: Focus search with `Ctrl/Cmd + F` and toggle or resize persistent table columns (also supported in **Images** and **Networks**).
- **Volume Details & File Explorer**: Inspect driver, mountpoint, creation date, reference count, and attached containers — and **browse, preview, edit, save, and delete files inside the volume using Monaco Editor** (up to **10 MB** per file, with binary-file protection). Behind the scenes, CatBee uses a short-lived `alpine:3.20` helper container mounted at `/data` (pulling `alpine:3.20` automatically on first use) and removes it cleanly after each operation.

---

## Networks

The **Networks** view lets you inspect and build container network topologies:

- **Create Custom Networks**: Choose driver (`bridge`, `overlay`, etc.), custom IPAM **Subnet**, **Gateway**, and **IP Range**, with unsaved draft protection.
- **Segmented Filters**: Filter by **All**, **In Use**, or **Unused**, and clean up with **Prune Unused**.
- **Network Details & Connected Containers**: View driver, scope, IPv6, internal, attachable, and ingress flags, IPAM configuration, and a live table of **Connected Containers** showing running state, short ID, image, assigned IPv4/CIDR address, and MAC address.
