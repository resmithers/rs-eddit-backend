const { expect } = require('chai');
const request = require('supertest')(require('../app'));
const connection = require('../db/connection.js');

process.env.NODE_ENV = 'test';

describe('/api', () => {
  beforeEach(() => {
    return connection.seed.run();
  });
  after(() => {
    return connection.destroy();
  });
  describe('/topics', () => {
    it('GET: should respond with array of all topics, with correct length and keys', () => {
      return request.get('/api/topics')
        .expect(200)
        .then((result) => {
          expect(result.body.topics).to.be.an('array');
          // expect(result.body.topics).to.have.length(2);
          expect(result.body.topics[0]).to.contain.keys(['slug', 'description']);
        });
    });
    it('POST: should add Topic to db and respond with 201 and new Topic data', () => {
      const newTopic = {
        slug: 'Elephants',
        description: 'Elephants never forget',
      };
      return request
        .post('/api/topics')
        .send(newTopic)
        .expect(201)
        .then((res) => {
          expect(res.body.topic).to.contain.keys(['slug', 'description']);
        });
    });
  });
  describe('/articles', () => {
    describe('/', () => {
      it('GET: should respond with array of all articles, with correct page length, article count and keys', () => {
        return request.get('/api/articles')
          .expect(200)
          .then((result) => {
            expect(result.body.articles).to.be.an('array');
            expect(result.body.articles).to.have.length(10);
            expect(+result.body.total_articles).to.eql(12);
            expect(result.body.articles[0]).to.contain.keys(['article_id', 'title', 'body', 'votes', 'topic', 'author', 'created_at', 'comment_count']);
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
    describe('/:article_id', () => {
      it('GET: should respond with article object, with correct keys and article_id', () => {
        return request.get('/api/articles/1')
          .expect(200)
          .then((result) => {
            expect(result.body.articles.article_id).to.eql(1);
            expect(result.body.articles.title).to.eql('Living in the shadow of a great man');
            expect(+result.body.articles.comment_count).to.eql(13);
            expect(result.body.articles).to.contain.keys(['article_id', 'title', 'body', 'votes', 'topic', 'author', 'created_at', 'comment_count']);
          });
      });
      it('PUT: should respond with ammended article object', () => {
        return request
          .put('/api/articles/1')
          .send({ body: 'It\'ll be super nice if this works' })
          .expect(202)
          .then((result) => {
            expect(result.body.article.article_id).to.eql(1);
            expect(result.body.article.body).to.eql('It\'ll be super nice if this works');
          });
      });
    });
  });
});
