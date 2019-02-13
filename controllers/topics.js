const { fetchTopics, insertTopic } = require('../models');

exports.sendTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.send({ topics });
    })
    .catch(next);
};

exports.addTopic = (req, res, next) => {
  insertTopic(req.body)
    .then(([topic]) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};
