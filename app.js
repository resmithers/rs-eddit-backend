const app = require('express')();
const bodyParser = require('body-parser');
const apiRouter = require('./routes/apiRouter');

app.use(bodyParser.json());
app.use('/api', apiRouter);

// app.use((err, req, res, next) => {
//   res.status(500).send(err);
// });

module.exports = app;
