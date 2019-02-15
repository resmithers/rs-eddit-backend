const app = require('express')();
const bodyParser = require('body-parser');
const apiRouter = require('./routes/apiRouter');
const { handle400, handle500, validateQuery } = require('./errors');

app.use(bodyParser.json());
app.use(validateQuery);

app.use('/api', apiRouter);

app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'Page not found' });
});

app.use(handle400);
app.use(handle500);

module.exports = app;
