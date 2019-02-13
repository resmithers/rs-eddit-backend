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
  it('GET: should respond with JSON describing available endpoints on the API', () => {
    return request.get('/api')
      .expect(200)
      .then(({ body }) => {
        expect(body).to.be.an('object');
        expect(body.api['/topics']).to.contain.keys('GET', 'POST');
      });
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
          expect(res.body.article.body).to.eql('It\'ll be nice if this works.');
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
      it('PATCH: should respond vote incremented article object', () => {
        return request
          .patch('/api/articles/1')
          .send({ inc_votes: 1 })
          .expect(202)
          .then((result) => {
            expect(result.body.article.article_id).to.eql(1);
            expect(result.body.article.votes).to.eql(101);
          });
      });
      it('PATCH: should respond vote decrement article object', () => {
        return request
          .patch('/api/articles/1')
          .send({ inc_votes: -1 })
          .expect(202)
          .then((result) => {
            expect(result.body.article.article_id).to.eql(1);
            expect(result.body.article.votes).to.eql(99);
          });
      });
      it('DELETE: should respond 204 - no article message', () => {
        return request
          .delete('/api/articles/1')
          .expect(204);
      });
    });
    describe('/api/articles/:article_id/comments', () => {
      it('GET should respond with comment object, based on article ID', () => {
        return request.get('/api/articles/1/comments')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.an('array');
            expect(body.comments[0]).to.contain.keys(['comment_id', 'body', 'votes', 'author', 'created_at']);
            expect(body.comments[0].comment_id).to.eql(18);
            expect(body.comments[0].body).to.eql('This morning, I showered for nine minutes.');
          });
      });
      it('POST: should add comment to db, respond 201 and new comment data', () => {
        const newComment = {
          username: 'butter_bridge',
          body: 'This morning, I showered for twelve minutes.',
        };
        return request
          .post('/api/articles/1/comments')
          .send(newComment)
          .expect(201)
          .then(({ body }) => {
            expect(body.comments[0]).to.contain.keys(['comment_id', 'body', 'votes', 'author', 'created_at', 'article_id']);
            expect(+body.comments[0].comment_id).to.eql(19);
            expect(body.comments[0].body).to.eql('This morning, I showered for twelve minutes.');
          });
      });
    });
  });
  describe('/comments/:comment_id', () => {
    it('PATCH: should respond vote incremented comment object', () => {
      return request
        .patch('/api/comments/1')
        .send({ inc_votes: 1 })
        .expect(202)
        .then(({ body }) => {
          expect(body.comment.comment_id).to.eql(1);
          expect(body.comment.votes).to.eql(17);
        });
    });
    it('PATCH: should respond vote decrement comment object', () => {
      return request
        .patch('/api/comments/1')
        .send({ inc_votes: -1 })
        .expect(202)
        .then(({ body }) => {
          expect(body.comment.comment_id).to.eql(1);
          expect(body.comment.votes).to.eql(15);
        });
    });
    it('DELETE: should respond 204 - no comment message', () => {
      return request
        .delete('/api/comments/1')
        .expect(204);
    });
  });
  describe('/users', () => {
    it('GET: should respond with all user records, as array of objects', () => {
      return request.get('/api/users')
        .expect(200)
        .then(({ body }) => {
          expect(body.users).to.be.an('array');
          expect(body.users[0].username).to.eql('butter_bridge');
          expect(body.users).to.have.length(3);
        });
    });
    it('POST: should add user to db, respond with 201 and the user data', () => {
      const newUser = {
        username: 'PrincessConsuelaBananaHammock',
        name: 'phoebe',
        avatar_url: 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4',
      };
      return request.post('/api/users')
        .send(newUser)
        .expect(201)
        .then(({ body }) => {
          expect(body.user.username).to.eql(newUser.username);
          expect(body.user.name).to.eql(newUser.name);
        });
    });
    describe('/:username', () => {
      it('GET: should respond with relevant user object, based on request username', () => {
        return request.get('/api/users/butter_bridge')
          .expect(200)
          .then(({ body }) => {
            expect(body.user).to.be.an('object');
            expect(body.user.username).to.eql('butter_bridge');
            expect(body.user.name).to.eql('jonny');
          });
      });
    });
  });
});
