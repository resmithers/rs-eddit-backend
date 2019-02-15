exports.handle400 = (err, req, res, next) => {
  if (err.constraint === 'comments_article_id_foreign') err.code = 404;
  if (err.constraint === 'articles_topic_foreign') err.code = 400;
  if (err.constraint === 'articles_author_foreign') err.code = 400;
  const codeTable = {
    400: { code: 400, msg: 'Bad request' },
    404: { code: 404, msg: 'Page not found' },
    23502: { code: 400, msg: 'Violates not null condition' },
    23503: { code: 422, msg: err.detail },
    23505: { code: 422, msg: err.detail },
    '22P02': { code: 400, msg: 'Bad request, invalid primary key' },
  };
  if (codeTable[err.code] || err.status) {
    const { code } = codeTable[err.code || err.status];
    const { msg } = codeTable[err.code || err.status];
    res.status(code).send({ msg });
  } else next(err);
};

exports.handle500 = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: 'Internal Server Error' });
};


exports.handle405 = (req, res) => {
  res.status(405).send({ msg: 'METHOD not allowed' });
};
