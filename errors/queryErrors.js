exports.validateQuery = (req, res, next) => {
  const valid_sorts = { created_at: 1, title: 1, article_id: 1, comment_id: 1, votes: 1, body: 1, author: 1, comment_count: 1 };
  const queryO = {};
  const {
    author,
    topic,
    sort_by,
    order,
    limit,
    p,
  } = req.query;

  if (author) queryO.author = author;
  if (topic) queryO.topic = topic;
  if (sort_by && valid_sorts[sort_by]) queryO.sort_by = sort_by;
  if (order) queryO.order = order;
  if (limit) queryO.limit = limit;
  if (p) queryO.p = p;

  req.query = queryO;

  next();
};
