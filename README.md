Swagger.json defines all the service APIs which will be used in Conference Management application.

# Pre-Requisites
1. PostgreSQL ( optional ==> can be run in docker, see instructions below.)
2. Node >=6.x
3. Database created ( `cmts_dev` and `cmts_test` or the names provided in the config files)
4. Docker & Docker Compose installed ([Docker](https://docs.docker.com/engine/installation/), [Docker Compose](https://docs.docker.com/compose/install/))

# Dev Setup Instructions ( With native PostgreSQL installed & without docker)

1. Run `npm install -g yarn`
2. Run `yarn`
3. Run `NODE_ENV=development yarn run sequelize db:migrate`
4. Run `NODE_ENV=development yarn run sequelize db:seed:all`
5. Run `yarn run test` for running tests.
6. Run `yarn run dev`
7. The API Server will be running at `localhost:3001`

In case tests fail due to migrations, drop and recreate the database ( known bug with tests )

# Dev Setup Instructions ( With PostgreSQL running in docker)

1. Run `./scripts/run-dev-pg.sh` ( docker and docker-compose needs to be installed and running)
2. Connect to Postgres running in container using : 
    `psql postgres://postgres:postgres@127.0.0.1` or if you have pgcli installed for its awesomeness - 
    `pgcli postgres://postgres:postgres@127.0.0.1/`
3. Create 2 databases - 
    * `create database cmts_dev`
    * `create database cmts_test`
4. Quit psql/pgcli console by hitting `/q`
5. Run `NODE_ENV=development ./node_modules/.bin/sequelize db:migrate --options-path='./sequelizerc.js'`
6. Run `yarn run dev`
7. For running tests run `yarn test`
8. The API server will be running at `localhost:3001`

# Deployment

Deployments are done completely using docker, and docker-compose with compose files. Please follow the instructions to
deploy the app - 

1. Install docker & docker-compose in server
2. `git clone https://github.com/sandeepsunia/rest-api.git`
3. `cd rest-api`
4. `docker pull docker image-path` or 
    build it locally using - 
    `docker build docker-image .`
5. Run services using `sudo docker-compose -f docker/prod-compose.yml up -d`
6. [Every time any database changes happen] Run `sudo docker ps` & find the `CONTAINER ID` for `rest-api`, and follow the instructions - 
    i. `sudo docker exec -it <CONTAINER ID> bash`
    ii. `npm run sequelize db:migrate`
    iii. `exit`


<!-- # Services

* Seeding Policies for permississions

1. Run `yarn run tasks:run` with a valid `NODE_ENV`. -->
