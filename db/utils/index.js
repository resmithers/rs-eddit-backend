exports.formatArticleData = (articles) => {
  // return articles.reduce((obj, articleData) => {
  articles.forEach((article) => {
    article.created_at = new Date(article.created_at);
  });
  return articles;
};

exports.formatCommentData = (comments) => {
  comments.forEach((comment) => {
    comment.created_at = new Date(comment.created_at);
  });
  return comments;
};

exports.getLookup = (arr, source, target) => {
  return arr.reduce((obj, arrData) => {
    obj[arrData[target]] = arrData[source];
    return obj;
  }, {});
};

exports.formatCommentData = (data, lookup) => {
  return data.map(({ belongs_to, created_by, created_at, ...restOfData }) => ({
    article_id: lookup[belongs_to],
    author: created_by,
    created_at: new Date(created_at),
    ...restOfData,
  }));
};
