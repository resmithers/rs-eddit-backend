const app = require('./app');

const { PORT = 9090 } = process.env;


app.listen(PORT, (err) => {
  if (err) console.error(err);
  console.log('Listening on PORT:', PORT);
});
