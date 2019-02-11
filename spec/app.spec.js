const { expect } = require('chai');
const request = require('supertest')(require('../app'));
const connection = require('../db/connection.js');

process.env.NODE_ENV = 'test';

describe('/api', () => {
  beforeEach(() => {
    return connection.seed.run();
  });

  describe('/articles', () => {
    it('GET: should respond with array of all articles, with correct length and keys', () => {
      return request.get('/api/articles')
        .expect(200)
        .then((result) => {
          expect(result.body.articles).to.be.an('array');
          expect(result.body.articles).to.have.length(12);
          expect(result.body.articles[0]).to.contain.keys(['article_id', 'title', 'body', 'votes', 'topic', 'author', 'created_at']);
        });
    });
    it('POST: should add article to db and respond with 201 and new article data', () => {
      const newArticle = {
        title: 'Test Article',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'It\'ll be nice if this works.',
      };
      return request
        .post('/api/articles')
        .send(newArticle)
        .expect(201)
        .then((res) => {
          expect(res.body.article).to.contain.keys(['article_id', 'title', 'body', 'votes', 'topic', 'author', 'created_at']);
        });
    });
  });
});
