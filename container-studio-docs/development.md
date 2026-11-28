---
id: development
title: Development & Contributing
sidebar_position: 8
description: Build, run, test, lint, and package CatBee Container Studio from source.
---

# Development & Contributing

This guide covers building, running, testing, and packaging **CatBee Container Studio** locally from source.

---

## Prerequisites

- **Node.js** `v22` or newer (CI validates on Node `24` and `26`; release builds use Node `26`)
- **npm** `v10` or newer
- **Docker Engine** / **Docker Desktop** (optional if using CatBee's built-in engine)

---

## Project Layout

```text
catbee-container-studio/
├── frontend/                     # Angular renderer application
│   └── src/
│       ├── app/features/         # containers, images, volumes, networks, logs, settings
│       └── styles/               # SCSS tokens, light/dark themes, mixins
├── src/                          # Electron main process & preload bridge
│   ├── constants.docker.ts       # Runtime IDs, ports, default CLI & K8s versions
│   ├── ipc/                      # Typed IPC channels & handlers (docker, engine, k8s, app)
│   ├── main/
│   │   ├── app/                  # Menu, updater, protocol, quit confirmation
│   │   ├── docker/               # Dockerode services, context manager, embedded drivers
│   │   └── k8s/                  # kind cluster lifecycle manager
│   └── preload.ts                # Context bridge API
├── scripts/                      # Changelog, version bump, reset:env, CI engine tests
├── tests/                        # Vitest backend unit tests
├── electron-builder.config.mjs   # Windows, macOS, Linux packaging config
└── vitest.config.mts             # Vitest test configuration
```

---

## Setup & Local Development

1. **Clone and install dependencies**:

```bash
git clone https://github.com/catbee-technologies/catbee-container-studio.git
cd catbee-container-studio
npm install
cd frontend && npm install && cd ..
```

2. **Start Angular dev server + Electron concurrently**:

```bash
npm run app:serve
```

- Launches the Angular dev server on `http://localhost:4281`.
- Waits for the dev server and opens Electron with hot reloading.

---

## Testing & Code Quality

### Unit Tests (Vitest)

```bash
# Type-check tests and run Vitest suite
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Linting & Formatting

```bash
# Lint Electron main process & tests
npm run lint
npm run lint:fix

# Lint Angular frontend
npm run lint:ui
npm run lint:ui:fix

# Lint everything
npm run lint:all
```

### Resetting Local Dev Environment

To test fresh-install flows cleanly using the same teardown pipeline as production:

```bash
npm run build
npm run reset:env -- --dry-run
# Destructive: removes built-in engine, data, and app settings
npm run reset:env
```

---

## Production Packaging

```bash
# Compile frontend and main process bundles
npm run package

# Package for current OS
npm run dist

# Platform-specific targets (output to build/)
npm run dist:win
npm run dist:win:store
npm run dist:mac
npm run dist:linux
```

---

## License

MIT © Catbee Technologies. See the [License](/license) page for the full license text.
