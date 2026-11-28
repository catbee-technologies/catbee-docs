---
id: testcontainers
title: Testcontainers Setup
sidebar_position: 4
description: Complete guide to configuring Testcontainers (Java, Node.js, Go, Python, .NET) with CatBee Container Studio on Windows, macOS, and Linux.
---

# Setting Up Testcontainers

**Testcontainers** works seamlessly with **CatBee Container Studio's Built-in Container Engine** across **Windows**, **macOS**, and **Linux** — as well as from inside **WSL 2** distributions.

Because CatBee's built-in engine uses its own isolated socket or named pipe (so it never collides with Docker Desktop), most Testcontainers SDKs just need `DOCKER_HOST` (or `~/.testcontainers.properties`) pointed to CatBee's endpoint.

---

## Quick Reference: Endpoints by Platform

| Platform                                  | `DOCKER_HOST`                                                                              | `TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE` |
| ----------------------------------------- | ------------------------------------------------------------------------------------------ | --------------------------------------- |
| **Windows (Host PowerShell / CMD / IDE)** | `npipe:////./pipe/catbee-desktop` _(or `tcp://127.0.0.1:2375` if TCP exposure is enabled)_ | Not needed (or `/var/run/docker.sock`)  |
| **Windows (Inside WSL 2 distro)**         | Automatic via WSL Integration (`tcp://127.0.0.1:23750`)                                    | `/var/run/docker.sock`                  |
| **macOS (Lima VM)**                       | `unix://$HOME/.catbee/lima/catbee/sock/docker.sock`                                        | `/var/run/docker.sock`                  |
| **Linux (Rootless)**                      | `unix://$XDG_RUNTIME_DIR/catbee/docker.sock`                                               | Not needed                              |

:::tip Copying Your Exact Endpoint
You can inspect and copy the live endpoint directly in **Settings -> Docker Engine -> Builders & BuildKit** (select `catbee-desktop` and click the copy icon next to **Endpoint**).
:::

---

## Platform Setup Guides

### Windows (WSL 2 Engine)

CatBee exposes a Windows named pipe at `\\.\pipe\catbee-desktop` (`npipe:////./pipe/catbee-desktop`) that automatically translates Windows bind-mount paths (`C:\Users\me\...`) into WSL 2 paths (`/mnt/c/Users/me/...`).

#### Option A: Using Named Pipe (Recommended)

Set `DOCKER_HOST` for your user or test runner:

```powershell
# PowerShell (current session)
$env:DOCKER_HOST = "npipe:////./pipe/catbee-desktop"

# PowerShell (persist for your Windows user)
[Environment]::SetEnvironmentVariable("DOCKER_HOST", "npipe:////./pipe/catbee-desktop", "User")
```

Or add to `%USERPROFILE%\.testcontainers.properties`:

```properties
docker.host=npipe:////./pipe/catbee-desktop
```

:::note Windows Path Bind Mounts
When using `npipe:////./pipe/catbee-desktop`, CatBee's built-in request rewriter automatically converts Windows host paths in `HostConfig.Binds` and `HostConfig.Mounts` (such as Testcontainers `withFileSystemBind` or `withCopyFileToContainer`) into `/mnt/<drive>/...` paths inside WSL 2.
:::

#### Option B: Using Local TCP (`tcp://127.0.0.1:2375`)

Some older Testcontainers libraries or JVM clients on Windows prefer TCP over named pipes:

1. Open **Settings -> General**.
2. Enable **Expose daemon on `tcp://localhost:2375` without TLS** and click **Apply**.
3. Set:
   ```powershell
   $env:DOCKER_HOST = "tcp://127.0.0.1:2375"
   ```
   CatBee's TCP relay routes through the same pipe rewriter, so Windows bind-mount path translation still works automatically.

#### Option C: Running Tests Inside a WSL 2 Distro (Ubuntu, Debian, etc.)

1. Open **Settings -> Resources -> WSL Integration**.
2. Enable integration for your WSL 2 distribution and click **Apply**.
3. CatBee configures `/etc/profile.d/catbee-docker.sh` (`export DOCKER_HOST=tcp://127.0.0.1:23750`).
4. If your Testcontainers tests mount `/var/run/docker.sock` (for Ryuk), set:
   ```bash
   export TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE=/var/run/docker.sock
   ```

---

### macOS (Lima VM Engine)

On macOS, CatBee's Lima VM exposes its Docker socket at `~/.catbee/lima/catbee/sock/docker.sock`.

#### 1. Configure Environment Variables

Add the following to `~/.zshrc` (or `~/.bash_profile` / `~/.bashrc`):

```bash
export DOCKER_HOST="unix://${HOME}/.catbee/lima/catbee/sock/docker.sock"
export TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE="/var/run/docker.sock"
```

Reload your shell (`source ~/.zshrc`).

:::important Why `TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE` Matters on macOS
Testcontainers starts a **Ryuk** reaper container to clean up test containers automatically. Ryuk needs the Docker socket mounted **from inside the Lima VM**, where the socket path is `/var/run/docker.sock` (not `~/.catbee/lima/catbee/sock/docker.sock`). Setting `TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE=/var/run/docker.sock` tells Testcontainers to mount `/var/run/docker.sock` inside the guest VM while your test process talks to `$DOCKER_HOST` on the Mac host.
:::

#### 2. Optional: `~/.testcontainers.properties`

If you run tests from an IDE (IntelliJ IDEA, VS Code, Eclipse) that does not inherit `~/.zshrc` variables, create `~/.testcontainers.properties`:

```properties
docker.host=unix:///Users/<your-username>/.catbee/lima/catbee/sock/docker.sock
```

_(Note: `~/.testcontainers.properties` does not expand `$HOME` or `~` — use your full `/Users/<username>` path, and set `TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE=/var/run/docker.sock` in your IDE run configuration or launch environment.)_

#### 3. Optional: Symlink `/var/run/docker.sock`

If tools expect the standard `/var/run/docker.sock` path without setting `DOCKER_HOST`:

```bash
sudo ln -sf "$HOME/.catbee/lima/catbee/sock/docker.sock" /var/run/docker.sock
```

#### 4. Verify File Sharing Paths

In **Settings -> Resources -> File sharing**, make sure both your home directory (`~`) and `/var/folders` remain shared (both are enabled by default). Testcontainers uses `/var/folders` (`$TMPDIR`) and project directories when copying files or mounting volumes into containers.

---

### Linux (Native Rootless Engine)

On Linux, CatBee runs rootless Docker under your user at `$XDG_RUNTIME_DIR/catbee/docker.sock` (typically `/run/user/1000/catbee/docker.sock`, or `~/.catbee/run/docker.sock` if `XDG_RUNTIME_DIR` is unset).

Add to `~/.bashrc` or `~/.zshrc`:

```bash
if [ -n "${XDG_RUNTIME_DIR:-}" ]; then
  export DOCKER_HOST="unix://${XDG_RUNTIME_DIR}/catbee/docker.sock"
else
  export DOCKER_HOST="unix://${HOME}/.catbee/run/docker.sock"
fi
```

Because Linux rootless Docker runs natively on the host kernel without a VM, host paths and container bind-mount paths match directly — no `TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE` is required unless you symlink `/var/run/docker.sock`.

---

## Language & Framework Examples

### Java (JUnit 5 / Spring Boot / Maven / Gradle)

Modern `testcontainers-java` (`1.19+` / `2.x`) reads `DOCKER_HOST` and `TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE` automatically.

**Maven (`pom.xml`) / Gradle (`build.gradle`)**:

If running from an IDE where shell exports aren't inherited, pass them in your Surefire / Gradle test task or IDE Run Configuration:

```groovy
// build.gradle
test {
    useJUnitPlatform()
    // Example for macOS; on Windows use npipe:////./pipe/catbee-desktop
    environment 'DOCKER_HOST', "unix://${System.getProperty('user.home')}/.catbee/lima/catbee/sock/docker.sock"
    environment 'TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE', '/var/run/docker.sock'
}
```

**Sample Test**:

```java
import org.junit.jupiter.api.Test;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.junit.jupiter.api.Assertions.assertTrue;

@Testcontainers
class RedisContainerTest {

    @Container
    static GenericContainer<?> redis = new GenericContainer<>("redis:7-alpine")
        .withExposedPorts(6379);

    @Test
    void shouldStartRedis() {
        assertTrue(redis.isRunning());
    }
}
```

### Node.js / TypeScript (`testcontainers`)

`testcontainers` (npm) honors `DOCKER_HOST` and `TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE`:

```bash
# macOS example
DOCKER_HOST="unix://${HOME}/.catbee/lima/catbee/sock/docker.sock" \
TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE="/var/run/docker.sock" \
npx vitest run
```

```ts
import { GenericContainer } from 'testcontainers';

const container = await new GenericContainer('redis:7-alpine')
  .withExposedPorts(6379)
  .start();

console.log(`Redis listening on ${container.getHost()}:${container.getMappedPort(6379)}`);
await container.stop();
```

### Go (`testcontainers-go`)

`testcontainers-go` reads `DOCKER_HOST` and `TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE`:

```bash
# macOS
export DOCKER_HOST="unix://${HOME}/.catbee/lima/catbee/sock/docker.sock"
export TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE="/var/run/docker.sock"
go test ./...
```

### Python (`testcontainers-python`)

`testcontainers-python` uses the standard `docker` SDK environment (`DOCKER_HOST`):

```bash
# Windows PowerShell
$env:DOCKER_HOST = "npipe:////./pipe/catbee-desktop"
pytest
```

### .NET (`Testcontainers.DotNet`)

`Testcontainers.DotNet` respects `DOCKER_HOST` and `~/.testcontainers.properties`:

```powershell
$env:DOCKER_HOST = "npipe:////./pipe/catbee-desktop"
dotnet test
```

---

## Tips & Troubleshooting

### Verify Connection Before Running Tests

Run a quick check with CatBee's CLI or `curl`:

```bash
docker info
```

Make sure **CatBee Container Studio** is open and the built-in engine status in the bottom-left footer says **Engine running**.

### Ryuk Fails to Mount `/var/run/docker.sock` on macOS

- **Symptom**: `Mount denied` or `Cannot connect to the Docker daemon` inside `testcontainers/ryuk`.
- **Fix**: Ensure `TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE=/var/run/docker.sock` is set in the environment running your tests. As a temporary workaround, you can disable Ryuk with `TESTCONTAINERS_RYUK_DISABLED=true`, though keeping Ryuk enabled with the socket override is recommended for automatic container cleanup.

### Windows `npipe` Client Compatibility Issues

- **Symptom**: An older Docker client library cannot open `npipe:////./pipe/catbee-desktop`.
- **Fix**: Enable **Settings -> General -> Expose daemon on `tcp://localhost:2375` without TLS**, apply the setting, and set `DOCKER_HOST=tcp://127.0.0.1:2375`.

### Resource Saver During Long Test Suites

- If **Resource Saver** is enabled on Windows WSL 2, it only triggers after the configured idle timeout while **zero** containers are running, and wakes automatically when containers start. If you run back-to-back test suites, consider increasing the idle timeout in **Settings -> Resources -> Advanced**.

### High Open-File Count Containers (Kafka, Elasticsearch, LocalStack)

- CatBee automatically configures raised `default-ulimits` (`nofile` soft `82920`, hard `524288`) in the built-in engine, preventing "too many open files" errors in heavy Testcontainers modules.
