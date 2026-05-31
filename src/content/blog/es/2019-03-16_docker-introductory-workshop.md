---
title: "Workshop Introductorio a Docker"
description: "Workshop práctico de Docker en Rocka Labs: contenedores, imágenes, Dockerfiles, volúmenes, redes y Compose—introducción concreta para empezar."
pubDate: "2019-03-16"
heroImage: "/images/blog/posts/docker-introductory-workshop/hero.webp"
heroLayout: "side-by-side"
tags: ["talks", "tech", "devops"]
keywords: ["workshop Docker completo", "Docker desde cero tutorial práctico", "Dockerfiles volúmenes y redes", "Docker Compose para principiantes", "contenedores Docker paso a paso", "Docker en Rocka Labs", "cómo aprender Docker rápido"]
---

Si ya leíste mi post anterior sobre [Introducción a Docker](/es/blog/docker-introduction/), sabés que cubrí Docker desde el ángulo de los microservicios — la filosofía detrás de los contenedores y cómo encajan en arquitecturas modernas. Este workshop en **Rocka Labs** fue diferente: nos enfocamos en Docker en profundidad. Sin rodeos, sin teoría abstracta. Comandos reales, casos de uso reales, y suficiente práctica para que puedas arrancar desde cero.

El objetivo era salir del workshop con Docker funcionando en tu máquina y entendiendo qué está pasando, no solo copiando y pegando comandos. Grité esto mucho durante la sesión: entender el *por qué* hace que el *cómo* tenga mucho más sentido.

Acá está la grabación completa si querés verlo:

[Ver workshop en YouTube](https://www.youtube.com/watch?v=mJsiT4DtiFY)

---

## ¿Qué es Docker?

Docker es una plataforma de contenedores construida sobre Linux, desarrollada en Go. La idea central: **empacar tu aplicación con todo lo que necesita para correr** — código, runtime, librerías, configuración — en una unidad portátil llamada contenedor.

Lo primero que la gente pregunta es: ¿no es lo mismo que una máquina virtual? La respuesta corta es no, y la diferencia importa.

Una VM emula hardware completo — tiene su propio kernel, su propio sistema operativo, su propia pila completa. Un contenedor, en cambio, opera directamente sobre el kernel del sistema operativo del host usando tres tecnologías del kernel de Linux:

- **Namespaces** — Aíslan la visibilidad de recursos. Cada contenedor ve su propio árbol de procesos, su propia red, su propio sistema de archivos, sin ver lo que pasa afuera.
- **cgroups** — Limitan y miden el uso de recursos: CPU, memoria, I/O. Un contenedor no puede comerse todos los recursos de la máquina sin que nadie se dé cuenta.
- **chroot** — Modifica el directorio raíz de un proceso. El contenedor cree que está en su propio sistema de archivos, aunque comparte el kernel del host.

Sin capas de emulación, sin overhead de hipervisor. Por eso los contenedores arrancan en milisegundos, no en minutos, y pueden correr docenas en la misma máquina donde correrían dos o tres VMs.

Para verificar que Docker está corriendo bien:

```bash
docker info
docker version
```

---

## Imágenes

Las imágenes son las plantillas de solo lectura de las que nacen los contenedores. Están organizadas en **capas**: una capa base (generalmente un OS mínimo como Alpine o Ubuntu) más capas adicionales que agregan tu aplicación, dependencias, configuración.

Cada capa es inmutable. Cuando modificás una imagen, Docker agrega capas nuevas encima — nunca modifica las existentes. Esto hace que compartir capas entre imágenes sea eficiente: si diez imágenes comparten la misma capa base de Ubuntu, esa capa se almacena una sola vez.

Las imágenes viven en **registries**. El principal es [DockerHub](https://hub.docker.com/), que tiene miles de imágenes oficiales y de la comunidad. El formato del nombre es `repository:tag`, y si no especificás el tag, Docker asume `latest`.

Comandos básicos para trabajar con imágenes:

```bash
# Ver imágenes disponibles localmente
docker images

# Descargar una imagen desde DockerHub
docker pull python:3.9

# Buscar imágenes disponibles
docker search python

# Correr un contenedor desde una imagen
docker run python:3.9 python --version
```

Hay tres formas de crear una imagen propia:
1. **Commiteando** el estado de un contenedor en ejecución
2. **Construyendo** desde un Dockerfile (la forma recomendada)
3. **Importando** desde un archivo `.tar`

La opción 2 es la que vas a usar el 99% del tiempo. El Dockerfile es la receta de tu imagen.

---

## Ciclo de Vida de un Contenedor

Un contenedor tiene dos ciclos de vida posibles.

El **ciclo básico** es simple: creás el contenedor desde una imagen, corre un proceso, el proceso termina y el contenedor se destruye. Es efímero por diseño. Perfecto para correr scripts, tareas batch, o pruebas rápidas.

El **ciclo avanzado** permite parar y reiniciar contenedores preservando los datos en volúmenes. Un contenedor parado no pierde su estado interno — podés volver a levantarlo donde lo dejaste.

Los comandos que más vas a usar:

```bash
# Ver contenedores en ejecución
docker ps

# Ver todos los contenedores (incluyendo parados)
docker ps -a

# Correr un contenedor de forma interactiva
docker run -it ubuntu bash

# Parar un contenedor
docker stop <id>

# Arrancar un contenedor parado
docker start <id>

# Matar un contenedor de forma abrupta
docker kill <id>

# Eliminar un contenedor
docker rm <id>

# Adjuntarte a un contenedor en ejecución
docker attach <id>
```

Sobre los flags interactivos: `-i` habilita STDIN (permite enviar input al contenedor) y `-t` asigna un pseudo-terminal. Juntos, `-it`, te dan una sesión interactiva real.

Un detalle importante: si querés salir de un contenedor interactivo **sin detenerlo**, usá `CTRL + P + Q`. Si presionás `exit` o `CTRL + C`, el proceso principal termina y el contenedor se para.

Los exit codes también importan: `0` significa éxito, cualquier otro número indica error. Útil cuando automatizás flujos con contenedores.

---

## Dockerfile

El Dockerfile es donde definís tu imagen. Es un archivo de texto con instrucciones que Docker ejecuta en orden para construir la imagen capa por capa.

Las instrucciones más importantes:

```dockerfile
# Imagen base — el punto de partida
FROM python:3.9-slim

# Ejecutar comandos durante el build (instalar dependencias, etc.)
RUN apt-get update && apt-get install -y curl

# Copiar archivos del host al contenedor
COPY requirements.txt .
COPY src/ /app/src/

# Establecer el directorio de trabajo
WORKDIR /app

# Documentar qué puerto expone el contenedor (no publica el puerto)
EXPOSE 8000

# Declarar un volumen para datos persistentes
VOLUME /data

# Comando por defecto cuando arranca el contenedor
CMD ["python", "-m", "http.server", "8000"]
```

Sobre `CMD` vs `ENTRYPOINT`: `CMD` define el comando por defecto pero podés sobreescribirlo al correr el contenedor. `ENTRYPOINT` define el punto de entrada fijo — podés pasarle argumentos dinámicos pero no sobreescribir el comando base. Para scripts que aceptan parámetros, `ENTRYPOINT` es más robusto.

`CMD` acepta dos formatos:
- **Shell form**: `CMD ping -c 10 www.google.com` — corre via `/bin/sh -c`
- **Exec form**: `CMD ["ping", "-c", "10", "www.google.com"]` — corre directamente, sin shell. Es el recomendado.

Solo puede haber **un `CMD` por Dockerfile**. Si ponés varios, solo el último tiene efecto.

Para construir la imagen:

```bash
# Build básico con tag
docker build -t mi-app:1.0 .

# Build sin cache (útil para forzar reinstalación de dependencias)
docker build --no-cache -t mi-app:1.0 .

# Ver el historial de capas de una imagen
docker history mi-app:1.0
```

El `.` al final es el contexto de build — el directorio que Docker envía al daemon para construir la imagen.

---

## Volúmenes

Por defecto, los datos escritos dentro de un contenedor desaparecen cuando el contenedor muere. Los **volúmenes** resuelven esto: son directorios persistentes que viven fuera del sistema de archivos del contenedor y sobreviven a su destrucción.

Hay dos razones principales para usar volúmenes:

1. **Persistencia de datos** — Bases de datos, uploads de usuarios, logs que necesitás conservar.
2. **Rendimiento** — Los volúmenes tienen mejor performance que el sistema copy-on-write de Docker, especialmente para I/O intensivo.

Además, los cambios en volúmenes no se incluyen cuando guardás el estado de un contenedor como imagen, y podés compartir el mismo volumen entre múltiples contenedores.

```bash
# Crear un volumen
docker volume create mi-datos

# Listar volúmenes
docker volume ls

# Inspeccionar un volumen
docker volume inspect mi-datos

# Eliminar un volumen
docker volume rm mi-datos

# Montar un volumen al correr un contenedor
docker run -v mi-datos:/app/data mi-app

# Montar un directorio del host (útil en desarrollo)
docker run -v /ruta/en/host:/app/data mi-app

# Montar en modo solo lectura
docker run -v /ruta/en/host:/app/data:ro mi-app
```

En Dockerfile, podés declarar un volumen con:

```dockerfile
VOLUME /data
```

Esto documenta que el directorio `/data` está pensado para datos persistentes. Docker crea un volumen anónimo automáticamente cuando corrés el contenedor si no especificás uno explícito.

En desarrollo, montar el directorio de trabajo del host al contenedor (`-v $(pwd):/app`) es una de las combinaciones más poderosas: ves los cambios en tiempo real sin tener que rebuildir la imagen.

---

## Redes

Docker implementa un DNS interno a través de la interfaz `docker0`, creando interfaces virtuales para que los contenedores se comuniquen entre sí. Por defecto, los contenedores están aislados de la red del host pero pueden comunicarse entre sí si están en la misma red.

Existen tres tipos principales de red en Docker:

- **bridge** (por defecto) — Los contenedores se comunican via IP. Ideal para la mayoría de casos en una sola máquina.
- **overlay** — Para comunicación entre contenedores en múltiples hosts. Lo usás con Docker Swarm.
- **host** — El contenedor comparte directamente la red del host. Sin aislamiento de red.

```bash
# Crear una red
docker network create mi-red

# Listar redes
docker network ls

# Conectar un contenedor a una red
docker network connect mi-red mi-contenedor

# Desconectar
docker network disconnect mi-red mi-contenedor

# Inspeccionar una red
docker network inspect mi-red

# Correr un contenedor en una red específica
docker run --net=mi-red mi-app
```

El flag `--link` es otra forma de conectar contenedores — agrega entradas en el `/etc/hosts` del contenedor para que pueda resolver el nombre del otro por hostname:

```bash
docker run --link mi-base-de-datos:db mi-app
```

Aunque funciona, las redes personalizadas son el enfoque moderno recomendado porque ofrecen resolución DNS automática entre contenedores por nombre.

---

## Docker Compose

Llegamos a la parte donde todo encaja. **Docker Compose** permite orquestar múltiples contenedores con un solo archivo de configuración: `docker-compose.yml`.

En lugar de correr cinco comandos `docker run` con mil flags cada uno, definís toda la arquitectura de tu aplicación en un archivo YAML y levantás todo con un comando. Docker Compose determina automáticamente el orden de arranque basándose en las dependencias que declarás.

Los contenedores se nombran siguiendo el patrón `<proyecto>_<servicio>_<número>`. Docker Compose también crea redes overlay automáticamente para que los servicios puedan comunicarse entre sí por nombre.

Un ejemplo clásico: una app web con Redis como cache:

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "8000:8000"
    volumes:
      - .:/app
    depends_on:
      - redis
    environment:
      - REDIS_URL=redis://redis:6379

  redis:
    image: redis:7-alpine
    volumes:
      - redis-data:/data

volumes:
  redis-data:
```

Con este archivo, `web` puede hablar con `redis` usando simplemente `redis` como hostname — Docker Compose resuelve el nombre automáticamente. El volumen `redis-data` persiste los datos de Redis entre reinicios.

Los comandos principales:

```bash
# Construir las imágenes
docker-compose build

# Levantar todos los servicios (en foreground)
docker-compose up

# Levantar en background
docker-compose up -d

# Parar los servicios
docker-compose stop

# Eliminar los contenedores (sin eliminar volúmenes)
docker-compose rm

# Parar y eliminar contenedores, redes y volúmenes
docker-compose down

# Escalar un servicio a N instancias
docker-compose scale web=3
```

Para proyectos con más de un contenedor, Docker Compose es prácticamente indispensable. Pasar de correr contenedores manualmente a un `docker-compose up` es uno de esos saltos de productividad que sentís inmediatamente.

---

## Un vistazo rápido a lo avanzado

El workshop también tocó brevemente tres temas más avanzados que vale la pena conocer:

**Docker Machine** — Una herramienta para provisionar hosts de Docker en máquinas remotas o locales. Soporta VirtualBox para entornos locales y proveedores cloud como Amazon EC2 y Digital Ocean. Útil para gestionar múltiples hosts Docker desde tu terminal.

**Seguridad** — El daemon de Docker requiere permisos de root para correr. Los usuarios en el grupo `docker` tienen acceso equivalente a root sobre el sistema. En producción, es importante configurar TLS para comunicaciones seguras con el daemon, y complementar con AppArmor, SELinux o GRSEC para una defensa más profunda.

**Docker Swarm** — El modo de clustering nativo de Docker. Permite convertir un grupo de hosts Docker en un clúster, con orquestación de servicios, networking overlay automático entre hosts y service discovery. Es la alternativa a Kubernetes para equipos que quieren orquestación sin agregar tanta complejidad operativa.

---

## Por dónde seguir

Si el workshop despertó tu curiosidad y querés ir más profundo, la documentación oficial de Docker es excelente:

---

## Recursos

### Grabación y código

- [Workshop en YouTube — Rocka Labs](https://www.youtube.com/watch?v=mJsiT4DtiFY)

### Contexto previo

- [Introducción a Docker — microservicios y conceptos base](/es/blog/docker-introduction/)

### Documentación oficial

- [Guía de inicio con Docker](https://docs.docker.com/engine/getstarted/)
- [Docker Hub — Registro público de imágenes](https://hub.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Docker Swarm](https://docs.docker.com/engine/swarm/)
- [Docker Machine](https://docs.docker.com/machine/)

---

A seguir construyendo.
