---
id: global-logs
title: Global Logs Hub
sidebar_position: 3
description: Stream, filter, and search logs concurrently across multiple running containers in real time.
---

# Global Logs Hub

The **Logs** page aggregates live `stdout` and `stderr` streams across your active containers into a single unified timeline — ideal for tracing microservice interactions or Compose stacks.

## Capabilities

- **Container Selection Drawer & Live Sync**: Search and toggle specific containers (`Select All` / `Remove All`, or `Select filtered` / `Remove filtered` while searching). Your selection persists across sessions, and a live Docker `events` listener automatically picks up newly created or removed containers.
- **Color-Coded Source Badges**: Each container is assigned a distinct color dot and badge (`16`-color palette) so interleaved logs remain easy to trace across services.
- **Configurable Virtualized Buffer**: Built on **TanStack Virtual** for low-memory scrolling with selectable **Max log entries** (`5,000`, `10,000`, `20,000`, or `25,000` lines) and automatic per-container tail splitting.
- **Search, Isolation & Navigation**: Focus search with `Ctrl/Cmd + F` and filter using **Case Sensitive (`Aa`)**, **Whole Word (`W`)**, **Regex (`.*`)**, **Filter to matches only**, live match counter / regex error warning, `Enter` / `Shift+Enter` match navigation, and floating **Scroll to top / bottom** jump buttons.
- **Display Options & Persistent Clear**: Under **Options**, toggle **Show timestamp**, **Wrap lines**, and **Local dates** (converts UTC timestamps inside log lines to local system time). Includes ANSI color rendering, hover line highlighting, clickable URLs, **Follow** auto-scroll lock, one-click log copy, and **Clear Logs** (persists per-container `since` timestamps so cleared output stays hidden across reloads while new logs continue streaming).
