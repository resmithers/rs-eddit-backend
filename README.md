# rs-knews (BE2-NC-KNEWS)

This is an api for interacting with an sql database of news data, in the form, users, topics, articles and comments.

All the data is returned in JSON format for easy integration with your frontend applications.

To see what endpoints are supported click: [api](https://rs-knews.herokuapp.com/api)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

Navigate to the target folder in terminal

```
git clone https://github.com/resmithers/BE2-NC-Knews.git
```
This will copy the project onto your local machine.

### Prerequisites

All of the project's dependencies are up to date in the package.json, so can be easily installed from your preferred terminal application with:

```
$ npm i
```

But if that is not succesful then you can manually install as follows

```
$ npm install -d express body-parser knex pg
$ npm install -D mocha chai supertest nodemon
```

### Installing

Setting up the database

```
$ npm run setup-dbs
$ npm run migrate:rollback 
$ npm run migrate:latest
$ npm run seed:db
```

This will drop the database if it exists, and create a new database. Migrations will then be run, ensuring that the table schemas are correctly applied within the database. 

## Running the app

To run the app, simply run the following command in the projects root folder

```
$ npm run dev
```

This script requires that the dev dependency nodemon be installed, and that the dev script in the project's package.json contains the following

```
$ scripts: { ... "dev": "nodemon listen.js" ... }
```

## Running the tests

Testing for this project uses mocha, supertest and the chai assertion library, the test suite has been provided for you

To run the test suite

```
$ npm t
```

### API Tests

These tests are written to check data output, and response to client requests.

The tests are batched by type, and seperated by endpoint.

Prior to each test run, the database is re-seeded to ensure reliability of data.

## Built With

* [Express](https://expressjs.com) - Web framework 
* [PostgreSQL](https://www.postgresql.org) - SQL Database Resource
* [Knex](https://knexjs.org) - SQL Database Querybuilder

## Authors

* **Rory Smith** - *Initial work* - [resmithers](https://github.com/resmithers)

## License

This project is licensed by me, for me, to me (i.e. there's no formal licensing)

## Acknowledgments

* Hat tip to [theShumanator](https://github.com/theshumanator) for being the extra bracket finder extraordinaire

