<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description
# PeliculasNest

PeliculasNest es una API desarrollada con NestJS que permite gestionar películas, integrándose con la API de Star Wars (SWAPI) y autenticación basada en JWT.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión recomendada: 18+)
- [PostgreSQL](https://www.postgresql.org/)


## Instalación

1. Clona el repositorio:

   ```sh
   git clone https://github.com/JerlibGnzlz/peliculasNest
   cd peliculasNest
   ```

2. Instala las dependencias:

   ```sh
   npm install
   ```

## Configuración del Entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
DATABASE_URL="postgresql://postgres:xxxxx@localhost:5432/starwars"
JWT_SECRET="secret"
SWAPI_API_URL="https://swapi.dev/api/films/"
PORT=3001
```

Para el entorno de producción, usa:

```env
DATABASE_URL="postgresql://movienest_user:u8AB1kPbkbjd5vnnosMZgVn0B1mlMaPB@dpg-cv7n98tds78s73cobl40-a.oregon-postgres.render.com/movienest"
```

## Ejecutar la Aplicación

### Modo Desarrollo

```sh
npm run start
```

La aplicación estará disponible en `http://localhost:3001`

### Modo Producción

```sh
npm run build
npm run start:prod
```

## Migraciones y Seed de Prisma

1. Generar la migración de Prisma:
   ```sh
   npx prisma migrate dev --name init
   ```
2. Subir el seed a la base de datos:
   ```sh
   npx prisma db seed
   ```

## Pruebas

Ejecutar las pruebas con Jest:

```sh
npm run test
```

## Endpoints

### Producción (Deploy en Render)

- Endpoint de películas SWAPI: [`https://peliculasnest.onrender.com/movies/swapi`](https://peliculasnest.onrender.com/movies/swapi)

### Desarrollo (Local)

- Local: [`http://localhost:3001/movies/swapi`](http://localhost:3001/movies/swapi)


- Swagger UI: [`http://localhost:3001/api`](http://localhost:3001/api)

## Usuarios de Prueba

Se han creado dos usuarios con diferentes roles:

**Administrador (ADMIN):**

```json
{
  "name": "admin",
  "email": "ad@gmail.com",
  "password": "123456",
  "role": "ADMIN"
}
```

**Usuario Regular (USER):**

```json
{
  "email": "admin@gmail.com",
  "password": "123456",
  "role": "USER"
}
```



