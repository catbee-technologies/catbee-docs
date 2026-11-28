---
id: containers
title: Containers, Compose & Files
sidebar_position: 1
description: Manage Docker containers, Compose projects, streaming logs, xterm.js terminal, Monaco files browser, env/mounts/ports editing, and telemetry.
---

# Containers, Compose & Files

The **Containers** workspace is the primary cockpit for inspecting and controlling running or stopped containers and Docker Compose stacks.

---

## Container Dashboard & Compose Grouping

- **Docker Compose Grouping**: Containers belonging to a Compose project are automatically grouped in collapsible cards (with collapsed states remembered per session) along with collective status summaries and **aggregate CPU, Memory, Disk I/O, and Network I/O** metrics.
- **Live Fleet Telemetry**: Header **Container CPU usage** and **Container memory usage** summaries, `Running` / `Stopped` badges, a live Docker `events` listener for instant state updates, and 10-second background runtime stats polling.
- **Coordinated Group & Bulk Actions**: Start, stop, restart, pause, unpause, **Force Recreate**, or delete individual containers, multi-selected rows (with `Shift+Click` range selection), or entire Compose projects.
- **Interactive Port Pills**: Click any published port badge to open the mapped endpoint directly in your browser.
- **Quick Filters**: Focus search with `Ctrl/Cmd + F` to filter by name, ID, or image, toggle **Show only running**, and toggle **Show k8s managed** to show or hide Kubernetes system/node containers.
- **Customizable Persistent Columns**: Toggle any of 10 optional columns (`ID`, `Image`, `Ports`, `State`, `Status`, `CPU`, `Memory`, `Disk R/W`, `Network I/O`, `PIDs`) and resize column widths with preferences persisted across sessions.

---

## Container Quick Switcher Sidebar

Inside **Container Details**, a collapsible **Quick Switcher Sidebar** lets you search and jump between containers without returning to the main list:

- Displays real-time status dots (`running`, `paused`, `stopped`) and total/running counts.
- Automatically centers and highlights the active container.
- Remembers its collapsed/expanded state across sessions and can be disabled anytime in **Settings -> General -> Enable quick switcher sidebar for containers**.

---

## Container Details Tabs

| Tab                  | Capabilities                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Summary Header**   | Image link, copyable container ID, state badge, published ports with **Edit Ports** action, live **Restart Policy** dropdown, CPU/memory stats, and lifecycle buttons                                                                                                                                                                                                                                                                                       |
| **Logs**             | ANSI-colored streaming stdout/stderr with virtualized scrolling, regex (`.*`) / case-sensitive (`Aa`) / whole-word (`W`) search, **Filter to matches only** isolation, `Enter` / `Shift+Enter` match navigation, clickable URLs, **Options** (**Show timestamp**, **Wrap lines**, **Local dates** UTC conversion, configurable **Tail lines** from `200` to `5,000`), auto-scroll **Follow** lock, and floating top/bottom jump buttons                     |
| **Terminal (Shell)** | Full PTY interactive shell powered by **xterm.js**, automatic `bash` -> `sh` -> `ash` -> `zsh` detection, **Find in terminal** bar (`Enter` / `Shift+Enter` to step matches, `Esc` to return focus), live connection status, and one-click **Reconnect**                                                                                                                                                                                                    |
| **Stats**            | Real-time streaming **Chart.js** graphs for CPU %, Memory usage vs. limits, Network I/O (`Rx`/`Tx`), and Block I/O (`Read`/`Write`), throttled when minimized to save host CPU                                                                                                                                                                                                                                                                              |
| **Files**            | Browse running container directories (requires `sh`, `bash`, `ash`, or `zsh`) with clickable breadcrumbs, `Name` / `Size` / `Modified` / `Mode` sorting, directory filtering (`Ctrl/Cmd + F`), drag- or keyboard-resizable split pane (`25%`–`75%`), session-remembered paths, file deletion, and **Monaco Editor** viewing/editing (up to **10 MB**, binary-file protection, `15s` directory load timeout). Symlinks are identified without following them |
| **Environment**      | Search (`Ctrl/Cmd + F`), copy, add, edit, or delete environment variables, or paste raw `.env` file contents directly into any field and save via container recreation                                                                                                                                                                                                                                                                                      |
| **Mounts**           | Inspect bind mounts, named volumes, and declared volume paths with summary counters; click a volume name to open Volume Details, click a bind-mount source to open the host folder, click a **Container path** or **Declared volume path** to jump directly into the **Files** tab at that path, or edit host paths/volumes in place                                                                                                                        |
| **Inspect**          | Searchable (`Ctrl/Cmd + F`), syntax-highlighted **JSON Viewer** of the full Docker inspect payload with one-click copy                                                                                                                                                                                                                                                                                                                                      |

---

## Safe Configuration Editing & Force Recreate

When editing **Environment Variables**, **Mounts**, or **Port Mappings** (or running **Force Recreate**):

- **Compose-Aware Recreation**: When Compose project files are accessible on the host, Force Recreate uses Docker Compose; otherwise, Engine recreation is used.
- **Rollback Protection**: Engine recreation retains the original image reference, unchanged named and anonymous volume sources, and unrelated port bindings. The original container is kept until the replacement container is created (and started, if it was running). On failure, CatBee attempts to restore the original container name, network connections, and running/paused state, reporting any recovery errors explicitly.
- **Safety Guards**: Unsaved drafts warn before closing dialogs, switching tabs, or navigating away. Running `--rm` (auto-remove) containers and containers sharing another container's network namespace are blocked from Engine recreation to prevent unsafe replacement.

### Editing Port Mappings

Click the **Edit port mappings** icon next to published ports in the **Summary Header**:

- Add new mappings or remove existing host bindings while selecting **TCP** or **UDP** protocol for each mapping.
- Enter a specific host port (`1`–`65535`) or `0` to have Docker assign a random ephemeral host port.
- Live validation prevents invalid port ranges and duplicate host-port or container-port/protocol collisions, and prompts before discarding or resetting unsaved changes.
- Click **Save & Recreate** to replace the container with the updated port bindings while preserving existing environment variables, mounts, and labels.

:::note Compose Containers & Engine Edits
Editing a Compose-managed container's environment, mounts, or ports in Container Studio uses the Docker Engine API and does **not** rewrite your `docker-compose.yml` file. Running `docker compose up` later will apply the Compose file definition.
:::
