exports.formatArticleData = (data) => {
  const articles = data[0];
  const { total_articles } = data[1][0];
  return { total_articles, articles };
};
