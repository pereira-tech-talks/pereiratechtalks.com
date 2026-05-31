---
title: "Docker Introductory Workshop"
description: "Hands-on Docker at Rocka Labs—from containers and images to Dockerfiles, volumes, networks, and Compose—your practical introduction to Docker."
pubDate: "2019-03-16"
heroImage: "/images/blog/posts/docker-introductory-workshop/hero.webp"
heroLayout: "side-by-side"
tags: ["talks", "tech", "devops"]
keywords: ["Docker workshop hands-on", "Dockerfile volumes networks tutorial", "Docker Compose beginners guide", "Docker images containers explained", "Rocka Labs Docker workshop", "Docker from scratch tutorial", "container orchestration Docker Compose"]
---

There's a difference between knowing that Docker exists and actually knowing Docker. I had been using containers for a while at that point — mostly following other people's `docker-compose.yml` files, tweaking environment variables, running `docker ps` to see what was running. Useful, but shallow. When the opportunity came to run a proper hands-on workshop at Rocka Labs, I decided to build the session I wished I had taken: one that explains what Docker actually is from the ground up, works through each concept with real commands, and leaves you feeling like you understand the tool rather than just the workflow around it.

The recording is on YouTube if you want to watch the full session: [Docker Introductory Workshop](https://www.youtube.com/watch?v=mJsiT4DtiFY).

If you want the higher-level picture of how Docker fits with microservice architectures, check out the earlier [Docker Introduction](/blog/docker-introduction/) post first. This one goes deep into Docker itself.

---

## What Is Docker?

Docker is a container platform built on top of Unix, written in Go. It's been around since 2013 and has changed how software gets built, shipped, and run.

The question everyone asks first is: **what's the difference between a container and a virtual machine?**

A VM emulates an entire machine — hardware, operating system, all of it — using a hypervisor layer. That layer adds overhead. Each VM carries its own full OS kernel, which means memory and disk usage add up fast.

A container does something smarter. Instead of emulating hardware, it shares the host OS kernel and uses three Linux primitives to create isolation:

- **Namespaces** — control what a process can see (file system, network interfaces, process IDs). Each container sees its own isolated view of the system.
- **cgroups** (control groups) — control what a process can use (CPU, memory, disk I/O). A container can be limited so it doesn't consume all available resources.
- **chroot** — changes the apparent root directory for a process. The container thinks it's the root of the world.

No emulation. No hypervisor overhead. Containers start in milliseconds, use far less memory than VMs, and can run many more instances on the same host. The trade-off is that all containers share the host kernel — you can't run a Windows container on a Linux host without additional tooling.

Two commands to get oriented when you first install Docker:

```bash
docker info     # Show system-wide information about the Docker installation
docker version  # Display Docker version details (client + daemon)
```

---

## Images

An image is a **read-only template** for creating containers. Think of it like a blueprint: it defines everything the container will contain — the OS, libraries, application code, configuration. Images are composed in **layers**, where each layer adds something on top of the previous one. A base Ubuntu layer, then a Python layer, then your app layer. Layers are cached, so building is fast and efficient.

Images are stored in **registries**. The public default is [Docker Hub](https://hub.docker.com/), which has thousands of community and official images for common tools: Python, Node.js, PostgreSQL, Redis, Nginx, and more. Private registries exist for company images.

Image naming follows a simple convention: `repository:tag`. The default tag when none is specified is `latest` — which is convenient but can cause surprises in production if you're not pinning versions.

Three ways to create an image:

1. **Commit** — run a container, make changes inside it, then commit the container state to a new image
2. **Dockerfile** — write a build script that Docker follows to create the image layer by layer (the standard approach)
3. **Import** — import a tar archive as an image

The commands you'll use most:

```bash
docker images                # List all images on the local machine
docker pull ubuntu:20.04     # Pull an image from Docker Hub
docker search python         # Search Docker Hub for images
docker run ubuntu:20.04      # Run a container from an image
```

---

## Container Lifecycle

A container is a **running instance of an image**. It has state. It goes through a lifecycle.

**Basic lifecycle:** Create from image → execute a process → process terminates → container stops.

**Advanced lifecycle:** Containers can be stopped and restarted without losing data, as long as that data is stored in volumes (more on that shortly). The container itself persists after the process exits — it enters a stopped state and can be started again.

The commands that matter:

```bash
docker ps           # List running containers
docker ps -a        # List all containers (including stopped)
docker run -it ubuntu:20.04 bash  # Run a container interactively
docker start [id]   # Start a stopped container
docker stop [id]    # Stop a running container gracefully
docker kill [id]    # Force kill a container
docker rm [id]      # Remove a stopped container
docker attach [id]  # Attach to a running container's process
```

The `-i` and `-t` flags for `docker run` are worth understanding:

- `-i` — keeps STDIN open. Without it, the container won't receive input.
- `-t` — allocates a pseudo-terminal. Without it, interactive sessions don't work properly.

You'll almost always use them together as `-it` for interactive containers.

One useful trick: if you're inside an interactive container and want to exit without stopping it, use `CTRL + P + Q`. That detaches your session and leaves the container running.

Exit codes matter too. When a container process finishes, the exit code tells you what happened: `0` means success, anything else (especially `1`) indicates an error.

---

## Dockerfile

A Dockerfile is the standard way to build images. It's a plain text file with instructions that Docker executes sequentially to create each layer of the image.

The key instructions:

```dockerfile
FROM ubuntu:20.04          # Base image — every Dockerfile starts here
RUN apt-get update         # Execute a command during the build process
COPY ./app /app            # Copy files from the host into the image
WORKDIR /app               # Set the working directory for subsequent instructions
EXPOSE 8080                # Document that the container listens on this port
VOLUME /data               # Define a persistent directory
CMD ["python", "app.py"]   # Default command to run when the container starts
```

**`CMD`** vs **`ENTRYPOINT`** is a common source of confusion:

- `CMD` sets the default command and arguments. It can be overridden entirely when running the container. Only the last `CMD` in a Dockerfile takes effect.
- `ENTRYPOINT` sets the entry point that always executes. Arguments passed to `docker run` are appended to it, not replacing it. This makes it ideal when you want the container to behave like an executable.

A simple example — a container that pings Google 10 times:

```dockerfile
FROM ubuntu:20.04
RUN apt-get update && apt-get install -y iputils-ping
CMD ["ping", "-c", "10", "www.google.com"]
```

Building it:

```bash
docker build -t my-ping-tool .         # Build and tag the image
docker build --no-cache -t my-ping-tool .  # Build without using cached layers
docker history my-ping-tool            # Show the layer history of an image
```

The `--no-cache` flag is useful when you need a completely fresh build — for example, when a `RUN apt-get update` might otherwise use a cached (and outdated) result.

---

## Volumes

Containers are ephemeral by nature. When you delete a container, everything written inside it is gone. **Volumes** solve this: they are persistent storage directories that exist outside the container's writable layer.

Volumes have several advantages over writing data inside the container:

- Data persists after the container is removed
- Volume I/O performs better than copy-on-write filesystem operations
- Changes to a volume are not included when you save (commit) an image
- Multiple containers can mount and share the same volume

Managing volumes:

```bash
docker volume create mydata         # Create a named volume
docker volume ls                    # List all volumes
docker volume inspect mydata        # Show details about a volume
docker volume rm mydata             # Remove a volume
```

Mounting a volume when running a container:

```bash
# Mount a named volume
docker run -v mydata:/app/data myimage

# Mount a host directory into the container
docker run -v /host/path:/container/path myimage

# Mount read-only
docker run -v /host/path:/container/path:ro myimage
```

In a Dockerfile, use `VOLUME` to declare that a directory should be treated as persistent:

```dockerfile
VOLUME /data
```

This is documentation as much as instruction — it tells Docker and anyone reading the Dockerfile that `/data` is expected to hold persistent data.

---

## Networks

By default, Docker creates a virtual network bridge called `docker0`. Every container gets a virtual interface on this bridge and receives an IP address in Docker's internal network. Docker also implements internal DNS, so containers can resolve each other by name rather than IP.

Docker supports several network types:

- **bridge** (default) — Containers on the same bridge network can communicate via IP. Isolated from the host network by default.
- **overlay** — Multi-host networking. Required for Docker Swarm to connect containers running on different machines.
- **host** — The container shares the host's network namespace directly. No network isolation, but maximum performance.

Working with networks:

```bash
docker network create mynetwork             # Create a network
docker network ls                           # List all networks
docker network inspect mynetwork            # Show details about a network
docker network connect mynetwork mycontainer    # Connect a container to a network
docker network disconnect mynetwork mycontainer # Disconnect a container from a network
```

Connecting containers:

```bash
# Link two containers (adds entries to /etc/hosts)
docker run --link my-database:db myapp

# Run a container in a specific network
docker run --net=mynetwork myapp
```

The `--link` flag is the older approach — it adds entries to `/etc/hosts` so containers can resolve each other by name. The preferred modern approach is to use named networks, which provide automatic DNS resolution for all containers in the network.

---

## Docker Compose

Running a single container manually works fine. Running a web server, a database, a cache layer, and a background worker together — with the right network connections, volumes, and environment variables — gets tedious fast. **Docker Compose** solves this.

Compose reads a `docker-compose.yml` file and brings up all the defined services together. It handles startup order automatically (services with dependencies start after their dependencies), creates networks connecting all services, and gives containers predictable names.

Container naming follows the pattern: `<project>_<service>_<number>`. So a `web` service in a project named `myapp` becomes `myapp_web_1`.

Here's a simple example — a web application backed by Redis:

```yaml
version: "3.8"

services:
  web:
    build: .
    ports:
      - "5000:5000"
    volumes:
      - .:/code
    depends_on:
      - redis

  redis:
    image: redis:alpine
```

The `web` service builds from the current directory's Dockerfile, maps port 5000, mounts the current directory as a volume (useful for development), and declares that it depends on `redis`. The `redis` service just pulls the official Alpine image. Compose creates an overlay network automatically connecting them.

The commands you'll live by:

```bash
docker-compose build         # Build or rebuild service images
docker-compose up            # Create and start containers (foreground)
docker-compose up -d         # Start containers in the background (detached)
docker-compose stop          # Stop running containers without removing them
docker-compose rm            # Remove stopped containers
docker-compose down          # Stop and remove containers, networks, and volumes
docker-compose scale web=3   # Scale a service to N instances
```

`docker-compose up -d` followed by `docker-compose logs -f` is a workflow I use constantly during development: start everything in the background, then tail the logs as I work.

---

## Quick Mentions: Machine, Security, Swarm

The workshop touched briefly on three more advanced topics that are worth knowing about:

**Docker Machine** provisions Docker hosts on remote machines or cloud providers. It installs Docker on a VM and configures your local client to talk to it. Supports VirtualBox locally as well as cloud providers like Amazon EC2 and DigitalOcean. Useful when you need to set up a Docker environment quickly without manual installation.

**Security** is something that often gets skipped in introductory material, but it matters. The Docker daemon runs as root, which means any user in the `docker` group effectively has root access to the host. Use TLS to secure communication with the Docker daemon over the network. Tools like AppArmor, SELinux, and GRSEC can add additional process-level security policies. In production, run your application as a non-root user inside the container.

**Docker Swarm** is Docker's built-in clustering and orchestration system. It lets you manage a pool of Docker hosts as a single swarm, deploy services across nodes, and scale automatically. Swarm provides native overlay networking for multi-host container communication and built-in service discovery. For smaller setups or teams that want orchestration without Kubernetes complexity, Swarm is a solid option worth exploring.

---

## Getting Started

If you're brand new to Docker, here's the path I'd recommend:

Install Docker Desktop for your platform, run `docker info` to confirm it's working, then start pulling images and running containers. The official Getting Started guide is genuinely good: [docs.docker.com/engine/getstarted/](https://docs.docker.com/engine/getstarted/).

From there, write your first Dockerfile. Package a simple script. Then graduate to a `docker-compose.yml` that connects two services. By the time you've done all of that, Docker won't feel like magic — it'll feel like a tool you understand.

---

[Watch the workshop recording on YouTube](https://www.youtube.com/watch?v=mJsiT4DtiFY)

Let's keep building.

---

## Resources

### Workshop

- [YouTube recording](https://www.youtube.com/watch?v=mJsiT4DtiFY) — Full Rocka Labs workshop session

### Related posts

- [Docker Introduction](/blog/docker-introduction/) — Docker and microservice-oriented architectures

### Official documentation

- [Docker Getting Started](https://docs.docker.com/engine/getstarted/) — Official beginner guide
- [Docker](https://www.docker.com/) — Main site and documentation
- [Docker Compose](https://docs.docker.com/compose/) — Compose reference and guides
- [Docker Machine](https://docs.docker.com/machine/) — Provisioning Docker hosts
- [Docker Swarm](https://docs.docker.com/engine/swarm/) — Swarm mode and orchestration
- [Docker Hub](https://hub.docker.com/) — Public image registry
