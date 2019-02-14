exports.handle400 = (err, req, res, next) => {
  const codeTable = {
    400: { code: 400, msg: 'Bad request' },
    404: { code: 404, msg: 'Page not found' },
    23502: { code: 400, msg: 'Violates not null condition' },
    23505: { code: 422, msg: 'Duplicate key violates unique constraint' },
  };
  if (codeTable[err.code] || err.status) {
    const { code } = codeTable[err.code || err.status];
    const { msg } = codeTable[err.code || err.status];
    res.status(code).send({ msg });
  } else next(err);
};

exports.handleNew = (err, req, res, next) => {
  console.log('****************', err);
};


exports.handle405 = (req, res) => {
  res.status(405).send({ msg: 'METHOD not allowed' });
};
