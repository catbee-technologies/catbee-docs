---
id: kubernetes
title: Local Kubernetes (kind)
sidebar_position: 5
description: Run single-node and multi-node local Kubernetes clusters inside CatBee Container Studio powered by kind and cloud-provider-kind.
---

# Local Kubernetes (`kind`)

CatBee Container Studio includes built-in local **Kubernetes** support powered by **[kind](https://kind.sigs.k8s.io/)** (Kubernetes IN Docker), allowing you to run single-node or multi-node clusters right on your workstation.

---

## Requirements

- **CatBee Built-in Engine** must be installed, running, and selected as the active engine. (External Docker engines are not used to host the CatBee-managed `kind` cluster.)
- **Linux**: Requires **cgroup v2** and the rootless prerequisites documented by [kind](https://kind.sigs.k8s.io/docs/user/rootless/).
- **Windows / macOS**: Works automatically with CatBee's WSL 2 and Lima VM built-in engines.

---

## Getting Started

1. Open **Settings -> Kubernetes**.
2. In **Kubernetes Runtime (kind)**, click **Install kind runtime**.
   - CatBee installs the `kind` binary (`v0.33.0`) into `~/.catbee/bin/kind` (on Windows, also inside the WSL distro at `/usr/local/bin/kind`).
3. Toggle **Enable Kubernetes** on.
4. Click **Apply** in the Settings footer to save and automatically start your `catbee-desktop` Kubernetes cluster.

:::info First Start Time
The first time a Kubernetes version starts, `kind` downloads the `kindest/node` image (~1 GB). Subsequent starts reuse the cached node image and launch much faster. You can monitor live progress stages in **Settings -> Kubernetes** or in the bottom-left status bar.
:::

---

## Cluster Configuration & Multi-Node Topologies

In **Settings -> Kubernetes -> Cluster Configuration**:

- **Kubernetes Version**: Choose from curated Kubernetes releases (`v1.29.x` through `v1.37.x`, default `v1.37.0`) or any compatible `kindest/node` release fetched from Docker Hub.
- **Cluster Nodes (`1` to `8`)**:
  - `1` node: 1 Control-plane node.
  - `2`–`8` nodes: 1 Control-plane node + `1`–`7` Worker nodes for testing scheduling, DaemonSets, affinity rules, and multi-node workloads.

:::warning Changing Version or Node Count
Changing the Kubernetes version or node count requires recreating the `catbee-desktop` cluster. CatBee displays a **Pending Cluster Changes** banner with **Apply & Recreate Cluster** so you confirm before workloads and cluster volumes are replaced.
:::

---

## Using `kubectl`

When the cluster starts, CatBee automatically exports the kubeconfig to `~/.kube/config` (or the path in `$KUBECONFIG`), registers the **`catbee-desktop`** context, and sets it as the active `kubectl` context.

Verify your cluster from any terminal:

```bash
kubectl config current-context
# catbee-desktop

kubectl get nodes
```

---

## `LoadBalancer` Services (`cloud-provider-kind`)

When starting the cluster, CatBee also launches a companion container (`catbee-kind-cloud-provider` using `docker.io/docker/desktop-cloud-provider-kind:v0.6.0`) so Kubernetes services with `type: LoadBalancer` receive reachable external IPs/port mappings locally.

- If the Kubernetes API is healthy (`Running`) but the companion container is unavailable, CatBee reports the cluster status as **Degraded** with a warning banner explaining that `LoadBalancer` services may not work.

---

## Managing the Cluster

- **Status Bar Indicator**: When Kubernetes is enabled, a Kubernetes status pill appears in the bottom-left footer showing live state (`Running`, `Starting`, `Stopping`, `Stopped`, `Degraded`, `Error`) and clicking it jumps straight to **Settings -> Kubernetes**.
- **Cancel Provisioning**: While a cluster is starting or resetting, click **Cancel** in **Settings -> Kubernetes** to abort provisioning and clean up partially created cluster nodes.
- **Reset Cluster**: Deletes and recreates a fresh `catbee-desktop` cluster (containers, images, and Docker volumes outside Kubernetes are preserved).
- **Show System Containers**: By default, internal `kind` node and `kube-system` containers are hidden from the main Containers list to keep your workspace clean. Toggle **Show k8s managed** in the Containers toolbar or **Show system containers (advanced)** in **Settings -> Kubernetes** to inspect them.
- **App Quit & Uninstall**: Quitting CatBee gracefully stops cluster containers; running **Factory Reset & Teardown** removes the cluster and cleans `catbee-desktop` entries out of `~/.kube/config`.
