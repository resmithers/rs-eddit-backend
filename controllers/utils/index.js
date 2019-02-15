const fs = require('fs');

exports.formatArticleData = (data) => {
  const articles = data[0];
  const { total_articles } = data[1][0];
  return { total_articles, articles };
};

exports.formatCommentData = (data) => {
  const comments = data.map(({ article_id, ...otherData }) => ({
    ...otherData,
  }));
  return { article_id: data[0].article_id, comments };
};

exports.serveEndpoints = (req, res, next) => {
  fs.readFile('./api.json', 'utf8', (err, data) => {
    if (err) next(err);
    else {
      res.send(JSON.parse(data));
    }
  });
};