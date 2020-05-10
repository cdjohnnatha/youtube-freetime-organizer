# Youtube freetime organizer


## Table of Contents

<!-- vscode-markdown-toc -->
1. [Intro](#Intro)
2. [Challenge](#Intro)
3. [Installation](#Installation)
    1. [Node](#Node)
    2. [Makefile](#Makefile)
    3. [Docker](#Docker)
4. [Usage](#Usage)
5. [Database](#Database)
6. [Swagger](#Swagger)
7. [Tests](#Tests)
8. [License](#License)


## 1. <a name='Intro'></a>Intro

The youtube-freetime-organizer is an api used to organize the freetime that can be used to watch videos on youtube. Using this api you will be able to create a schedule based in minutes available in week day and regarding that it is possible to search and show youtube videos and create a queue list of videos to be displayed in search order.

### 1.2. Database architecture

![picture](public/images/youtube_freetime_organized_db_diagram.jpg)

## 3. 📦 <a name='Installation'></a>Installation


### 3.1 Node
```
  npm install
  npm start
```

### 3.2 Makefile
```
    make production
```
### 3.3 Docker

#### Dependencies

    You need to have a docker and docker-compose installed in your machine.

```
    docker-compose up
```

## 5. 📖 <a name='Database'></a>Database

The database used is PostgreSQL and it was used an ORM called sequelize.js to integrate Node.js with PostgreSQL.


The database initialization it will pretty much create the database, run the migrations and run all seeds:

### 5.1 Node

```
  npm run build-database
```

## 7. 📄 <a name='Tests'></a>Tests

You can run the applications tests with

```
  npm test
```

## 8. 📄 <a name='License'></a>License
Simple Object Handler is [MIT licensed](./LICENSE).