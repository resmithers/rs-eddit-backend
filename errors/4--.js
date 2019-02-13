exports.handle400 = (err, req, res, next) => {
  const codeTable = {
    400: 'Bad request',
    23502: 'Violates not null condition',
  };
  if (codeTable[err.code] || err.status === 400) res.status(400).send({ msg: codeTable[err.code || err.status] });
  //   else if (err.status === 400) res.status(400).send({ msg: err.msg });
  else next(err);
};

exports.handle404 = (err, req, res, next) => {
  if (err.status === 404) res.status(404).send({ msg: 'Page not found' });
  else console.log('****************', err);
};

exports.handle405 = (req, res) => {
  res.status(405).send({ msg: 'METHOD not allowed' });
};
