const app = require('express')();
const bodyParser = require('body-parser');
const apiRouter = require('./routes/apiRouter');
const { handle400, handleNew } = require('./errors');

app.use(bodyParser.json());
app.use('/api', apiRouter);

app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'Page not found' });
});

app.use(handle400);
app.use(handleNew);

module.exports = app;
