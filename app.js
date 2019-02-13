const app = require('express')();
const bodyParser = require('body-parser');
const apiRouter = require('./routes/apiRouter');
const { handle400, handle404 } = require('./errors');

app.use(bodyParser.json());
app.use('/api', apiRouter);

app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'Page not found' });
});

app.use(handle400);
app.use(handle404);

module.exports = app;
