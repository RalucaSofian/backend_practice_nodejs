# Project Name: backend_practice_nodejs
## Project Description

The aim of the project is to create the back-end for a project representing a Pet Rescue,
where Users can register, search for a Pet, and adopt or foster it.


## Technologies Used

- TypeScript
- NodeJS
- Express
- TypeORM
- PostgreSQL


## Project Folder Structure

Source files of the project are saved under the following folder structure:

```bash
.
├── infra/
│   └── docker-compose.yml
└── src/
    ├── controllers/
    ├── migrations/
    ├── models/
    ├── services/
    ├── utils/
    ├── data-source.ts
    └── index.ts
```


## Installing the Project

The following commands are used for installing and running the project:

```bash
# start the local database
$: cd ./infra
$: docker compose up -d
✔ Container infra-local_db_node-1  Started
```

```bash
# install all dependencies
$: npm install

# build the project
$: npm run build

# create your .env file:
# LISTEN_PORT=****
# DB_HOSTNAME=****
# DB_PORT=****
# DB_USERNAME=****
# DB_PASSWORD=****
# DB_NAME=****
# SECRET_KEY=****

# start the local (development) server
$: npm run dev
```

Upon successful start of the development server, the following logs will be printed:

```bash
[server] Server running at: http://localhost:3000
[server] Data Source initialized
```


## Functionalities

- AUTH:
    - Register: password hashing and salting
    - Login: Bearer Token

- CRUD:
    - Individual GET by ID
    - Querying
        - Filtering
        - Search
        - Ordering
        - Pagination
    - Individual UPDATE and DELETE of entities

- TypeScript Migration System


## Migration System

The migration system makes use of TypeScript's TypeORM.

The commands used for creating and appying, or reverting, a new migration are the following:

```bash
# create a new migration file
$: cd ./src/migrations
$: npx typeorm migration:create name_of_migration_file

# apply all unapplied migrations
$: npx typeorm migration:run

# revert the last applied migration
$: npx typeorm migration:revert
```
