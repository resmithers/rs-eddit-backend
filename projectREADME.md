# rs-knews (BE2-NC-KNEWS)

This is an api for interacting with an sql database of news data, in the form, users, topics, articles and comments.

All the data is returned in JSON format for easy integration with your frontend applications.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

```
git clone https://github.com/resmithers/BE2-NC-Knews.git
```

### Prerequisites

All of the project's dependencies are up to date in the package.json, so can be easily installed from your preferred terminal application with:

```
$ npm i
```

But if that is not succesful then manually installing them with the below command should set you up

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

```
$ npm install -d express body-parser knex pg
$ npm install -D mocha chai supertest nodemon
```

End with an example of getting some data out of the system or using it for a little demo

## Running the tests

Testing for this project uses mocha, supertest and the chai assertion library, the test suite has been provided for you

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Express](https://expressjs.com) - Web framework 
* [PostgreSQL](https://www.postgresql.org) - SQL Database Resource
* [Knex](https://knexjs.org) - SQL Database Querybuilder

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [Git](http://git-scm.com/) for versioning. Previous versions can be found on [GitHub]()

## Authors

* **northcoders** - *Initial work* - [northcoders](https://github.com/northcoders)
* **Rory Smith** - *Initial work* - [resmithers](https://github.com/resmithers)

## License

This project is licensed by me, for me, to me.

## Acknowledgments

* Hat tip to [theShumanator](https://github.com/theshumanator) for being the extra bracket finder extraordinaire
