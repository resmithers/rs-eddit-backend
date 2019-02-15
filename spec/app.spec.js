const { expect } = require('chai');
const request = require('supertest')(require('../app'));
const connection = require('../db/connection.js');

process.env.NODE_ENV = 'test';

describe('', () => {
  beforeEach(() => {
    return connection.seed.run();
  });
  after(() => {
    return connection.destroy();
  });
  describe('BASIC ENDPOINT TESTS', () => {
    describe('/api', () => {
      it('GET: should respond with JSON describing available endpoints on the API', () => {
        return request.get('/api')
          .expect(200)
          .then(({ text }) => {
            expect(text).to.be.a('string');
            // expect(text.api['/topics']).to.contain.keys('GET', 'POST');
          });
      });
      describe('/topics', () => {
        it('GET: should respond with array of all topics, with correct length and keys', () => {
          return request.get('/api/topics')
            .expect(200)
            .then((result) => {
              expect(result.body.topics).to.be.an('array');
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
              .then(({ body }) => {
                expect(body.article.article_id).to.eql(1);
                expect(body.article.title).to.eql('Living in the shadow of a great man');
                expect(+body.article.comment_count).to.eql(13);
                expect(body.article).to.contain.keys(['article_id', 'title', 'body', 'votes', 'topic', 'author', 'created_at', 'comment_count']);
              });
          });
          it('PATCH: should respond vote incremented article object', () => {
            return request
              .patch('/api/articles/1')
              .send({ inc_votes: 1 })
              .expect(200)
              .then((result) => {
                expect(result.body.article.article_id).to.eql(1);
                expect(result.body.article.votes).to.eql(101);
              });
          });
          it('PATCH: should respond vote decrement article object', () => {
            return request
              .patch('/api/articles/1')
              .send({ inc_votes: -1 })
              .expect(200)
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
        describe('/comments', () => {
          it('GET should respond with comment object, based on article ID', () => {
            return request.get('/api/articles/1/comments')
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.be.an('array');
                expect(body.comments[0]).to.contain.keys(['comment_id', 'body', 'votes', 'author', 'created_at']);
                expect(body.comments[0].comment_id).to.eql(2);
                expect(body.comments[0].body).to.eql('The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.');
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
            .expect(200)
            .then(({ body }) => {
              expect(body.comment.comment_id).to.eql(1);
              expect(body.comment.votes).to.eql(17);
            });
        });
        it('PATCH: should respond vote decrement comment object', () => {
          return request
            .patch('/api/comments/1')
            .send({ inc_votes: -1 })
            .expect(200)
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
  });
  describe('ERROR TESTS', () => {
    it('/non-existent-endpoint should respond 404 and message', () => {
      return request.get('/kahsbdjab')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.eql('Page not found');
        });
    });
    describe('/api/topics', () => {
      it('POST:422 and responds with appropriate message', () => {
        const newTopic = {
          slug: 'mitch',
          description: 'The man, the Mitch, the legend',
        };
        return request
          .post('/api/topics')
          .send(newTopic)
          .expect(422)
          .then(({ body }) => {
            expect(body.msg).to.eql('Key (slug)=(mitch) already exists.');
          });
      });
      it('POST:400 and responds with appropriate message', () => {
        const newTopic = {
          slug: 'Elephants',
        };
        return request
          .post('/api/topics')
          .send(newTopic)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.eql('Violates not null condition');
          });
      });
      it('METHOD:405 and responds with appropriate message', () => {
        return request
          .delete('/api/topics')
          .expect(405)
          .then(() => {
            return request
              .patch('/api/topics')
              .expect(405);
          });
      });
    });
    describe('/api/articles', () => {
      it('POST:400 and responds with appropriate message', () => {
        const newArticle = {
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'It\'ll be nice if this works.',
        };
        return request
          .post('/api/articles')
          .send(newArticle)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.eql('Violates not null condition');
          });
      });
      it('POST:400 and responds with appropriate message', () => {
        const newArticle = {
          title: 'hiya',
          topic: 'bananas',
          author: 'butter_bridge',
          body: 'It\'ll be nice if this works.',
        };
        return request
          .post('/api/articles')
          .send(newArticle)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.eql('Bad request');
          });
      });
      it('POST:400 and responds with appropriate message', () => {
        const newArticle = {
          title: 'hiya',
          topic: 'mitch',
          author: 'PrincessConsuela',
          body: 'It\'ll be nice if this works.',
        };
        return request
          .post('/api/articles')
          .send(newArticle)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.eql('Bad request');
          });
      });
      it('METHOD:405 and responds with appropriate message', () => {
        return request
          .delete('/api/articles')
          .expect(405)
          .then(() => {
            return request
              .patch('/api/articles')
              .expect(405);
          });
      });
      describe('/:article_id', () => {
        it('GET:400 and responds with appropriate message', () => {
          return request
            .get('/api/articles/118118')
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.eql('Bad request');
            });
        });
        it('PATCH:400 and responds with appropriate message', () => {
          return request
            .patch('/api/articles/1')
            .send({ baloney: 7 })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.eql('Bad request');
            });
        });
        it('PATCH:400 no req.body, and responds with appropriate message', () => {
          return request
            .patch('/api/articles/1')
            .expect(200)
            .then(({ body }) => {
              expect(body.article.article_id).to.eql(1);
            });
        });
        it('PATCH:400 bad vote type, and responds with appropriate message', () => {
          return request
            .patch('/api/articles/1')
            .send({ inc_votes: 'Balloons' })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.eql('Bad request');
            });
        });
        it('DELETE:404 and responds with appropriate message', () => {
          return request
            .delete('/api/articles/118118')
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.eql('Bad request');
            });
        });
        it('METHOD:405 and responds with appropriate message', () => {
          return request
            .post('/api/articles/1')
            .expect(405)
            .then(() => {
              return request
                .put('/api/articles/1')
                .expect(405);
            });
        });
        describe('/comments', () => {
          it('GET:404 and responds with appropriate message', () => {
            return request
              .get('/api/articles/118118/comments')
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.eql('Page not found');
              });
          });
          it('GET:400 and responds with appropriate message', () => {
            return request
              .get('/api/articles/sasquatch/comments')
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.eql('Bad request, invalid primary key');
              });
          });
          it('POST:404 article_id not in range responds with appropriate message', () => {
            return request
              .post('/api/articles/118118/comments')
              .send({ username: 'butter_bridge', body: 'I think your article is awful' })
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.eql('Page not found');
              });
          });
          it('POST:400 invalid article_id responds with appropriate message', () => {
            return request
              .post('/api/articles/sasquatch/comments')
              .send({ username: 'butter_bridge', body: 'I think your article is awful' })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.eql('Bad request, invalid primary key');
              });
          });
          it('POST:400 invalid username in req.body responds with appropriate message', () => {
            return request
              .post('/api/articles/1/comments')
              .send({ username: 'PrincessConsuela', body: 'I think your article is awful' })
              .expect(422)
              .then(({ body }) => {
                expect(body.msg).to.eql('Key (author)=(PrincessConsuela) is not present in table "users".');
              });
          });
          it('METHOD:405 and responds with appropriate message', () => {
            return request
              .delete('/api/articles/118118/comments')
              .expect(405)
              .then(() => {
                return request
                  .put('/api/articles/118118/comments')
                  .expect(405);
              });
          });
        });
      });
    });
    describe('/comments/:comment_id', () => {
      it('PATCH:404 non existent comment responds with appropriate message', () => {
        return request
          .patch('/api/comments/118118')
          .send({})
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.eql('Page not found');
          });
      });
      it('PATCH:404 non existent comment responds with appropriate message', () => {
        return request
          .patch('/api/comments/118118')
          .send({ inc_votes: 'banana' })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.eql('Page not found');
          });
      });
      it('PATCH: no body, ignores and responds with comment object', () => {
        return request
          .patch('/api/comments/1')
          .send({})
          .expect(200)
          .then(({ body }) => {
            expect(body.comment.comment_id).to.eql(1);
          });
      });
      it('PATCH:400 inc_votes NaN responds with appropriate message', () => {
        return request
          .patch('/api/comments/1')
          .send({ inc_votes: 'banana' })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.eql('Bad request');
          });
      });
      it('DELETE:400 and responds with appropriate message', () => {
        return request
          .delete('/api/comments/118118')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.eql('Bad request');
          });
      });
      it('METHOD:405 and responds with appropriate message', () => {
        return request
          .post('/api/comments/118118')
          .expect(405)
          .then(() => {
            return request
              .put('/api/comments/118118')
              .expect(405);
          });
      });
    });
    describe('/users', () => {
      it('POST:400 and responds with appropriate message', () => {
        return request
          .post('/api/users')
          .send({})
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.eql('Violates not null condition');
          });
      }); it('POST:422 and responds with appropriate message', () => {
        return request
          .post('/api/users')
          .send({ username: 'butter_bridge',
            name: 'jonny',
            avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
          })
          .expect(422)
          .then(({ body }) => {
            expect(body.msg).to.eql('Key (username)=(butter_bridge) already exists.');
          });
      });
      it('METHOD:405 and responds with appropriate message', () => {
        return request
          .delete('/api/users')
          .expect(405)
          .then(() => {
            return request
              .put('/api/users')
              .expect(405);
          });
      });
      describe('/:username', () => {
        it('GET:404 and responds with appropriate message', () => {
          return request
            .get('/api/users/batman')
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.eql('Page not found');
            });
        });
        it('METHOD:405 and responds with appropriate message', () => {
          return request
            .delete('/api/users/butter_bridge')
            .expect(405)
            .then(() => {
              return request
                .put('/api/users/butter_bridge')
                .expect(405);
            });
        });
      });
    });
  });
  describe('QUERY TESTS', () => {
    describe('/articles', () => {
      it('GET: QUERY: sort_by, order, limit, p', () => {
        return request.get('/api/articles?limit=5&p=2&sort_by=article_id')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0].article_id).to.eql(7);
            expect(body.articles[2].article_id).to.eql(5);
            expect(body.articles[4].article_id).to.eql(3);
            expect(body.articles).to.have.length(5);
          });
      });
      it('GET: QUERY: author, sort_by', () => {
        return request.get('/api/articles?author=butter_bridge&sort_by=article_id')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0].article_id).to.eql(12);
            expect(body.articles[2].article_id).to.eql(1);
            expect(body.articles).to.have.length(3);
          });
      });
      it('GET: QUERY: topic, sort_by', () => {
        return request.get('/api/articles?topic=mitch&sort_by=article_id')
          .expect(200)
          .then(({ body }) => {
            expect(+body.total_articles).to.eql(11);
            expect(body.articles[0].article_id).to.eql(12);
            expect(body.articles).to.have.length(10);
          });
      });
      it('GET: BADQUERY: topic = banana', () => {
        return request.get('/api/articles?topic=banana')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal('Page not found');
          });
      });
      it('GET: BADQUERY: banana = banana', () => {
        return request.get('/api/articles?banana=banana')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.an('array');
            expect(body.articles).to.have.length(10);
            expect(+body.total_articles).to.eql(12);
            expect(body.articles[0]).to.contain.keys(['article_id', 'title', 'body', 'votes', 'topic', 'author', 'created_at', 'comment_count']);
          });
      });
    });
    describe('/articles/:article_id/comments', () => {
      it('GET: QUERY: sort_by, order', () => {
        return request.get('/api/articles/1/comments?sort_by=comment_id&order=asc')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments.length).to.eql(10);
            expect(body.comments[0].comment_id).to.eql(2);
            expect(body.comments[body.comments.length - 1].comment_id).to.eql(11);
          });
      });
      it('GET: BADQUERY: sort_by - should ignore bad sort query, and return data irrespective', () => {
        return request.get('/api/articles/1/comments?sort_by=elephant')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments[0]).to.have.keys('author', 'body', 'comment_id', 'created_at', 'votes');
            expect(body.comments[0].comment_id).to.eql(2);
          });
      });
      it('GET: QUERY: limit, p, sort_by, order', () => {
        return request.get('/api/articles/1/comments?p=1&limit=5&sort_by=comment_id&order=asc')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments.length).to.eql(5);
            expect(body.comments[0].comment_id).to.eql(2);
            expect(body.comments[body.comments.length - 1].comment_id).to.eql(6);
          });
      });
    });
  });
});
