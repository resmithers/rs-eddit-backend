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
