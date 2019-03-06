process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');
const connection = require('../db/connection');

const request = supertest(app);

describe.only('/', () => {
  beforeEach(() => connection.migrate
    .rollback()
    .then(() => connection.migrate.latest())
    .then(() => connection.seed.run()));

  after(() => connection.destroy());

  it('GET status:404 for any non-existent route', () => {
    return request.get('/mitchs-endless-charm').expect(404);
  });

  describe('/api', () => {
    describe('/topics', () => {
      it('GET status:200 responds with an array of topics objects', () => {
        return request
          .get('/api/topics')
          .expect(200)
          .then(({ body }) => {
            expect(body.topics).to.have.length(2);
            expect(body.topics[0]).to.eql({
              slug: 'mitch',
              description: 'The man, the Mitch, the legend',
            });
          });
      });
      it('POST status:201 responds with the added topic', () => {
        return request
          .post('/api/topics')
          .send({ slug: 'test', description: 'Test' })
          .expect(201)
          .then(({ body }) => {
            expect(body.topic.slug).to.equal('test');
            expect(body.topic.description).to.equal('Test');
          });
      });
      it('POST status:422 client sends a body with a duplicate slug', () => {
        return request
          .post('/api/topics')
          .send({ slug: 'mitch', description: 'Now with more Mitch!' })
          .expect(422);
      });
      it('POST status:400 if request body is malformed (missing description property)', () => {
        return request
          .post('/api/topics')
          .send({ slug: 'sluggy boi' })
          .expect(400);
      });
      it('status:405 invalid HTTP method for this resource', () => {
        const methods = ['patch', 'delete', 'put'];
        const expectations = methods.map(method => request[method]('/api/topics').expect(405));
        return Promise.all(expectations);
      });
    });

    describe('/articles', () => {
      describe('(CORE TESTS) --> GET status:200', () => {
        it('responds with an array of articles with correct keys', () => {
          return request
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.be.an('array');
              expect(body.articles[0]).to.contain.keys([
                'author',
                'title',
                'article_id',
                'votes',
                'created_at',
                'topic',
              ]);
            });
        });
        it('takes a topic query bringing articles for a given topic', () => {
          return request
            .get('/api/articles?topic=mitch')
            .expect(200)
            .then(({ body }) => {
              const allCoding = body.articles.every(
                ({ topic }) => topic === 'mitch',
              );
              expect(allCoding).to.equal(true);
            });
        });
        it('responds with an empty array for articles queried with non-existent topic', () => {
          return request
            .get('/api/articles?topic=ondesmartenont')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.eql([]);
            });
        });
        it('sorts articles (DEFAULT sort_by=created_at) (DEFAULT order=desc)', () => {
          return request
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.be.an('array');
              expect(body.articles[0].title).to.equal(
                'Living in the shadow of a great man',
              );
              expect(body.articles[9].title).to.equal(
                'Seven inspirational thought leaders from Manchester UK',
              );
            });
        });
        it('takes sort_by query which alters the column by which data is sorted (DEFAULT order=desc)', () => {
          return request
            .get('/api/articles?sort_by=title')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles[0].title).to.equal('Z');
            });
        });
        it('takes a order query which changes the sort to ascending (DEFAULT sort_by=created_at)', () => {
          return request
            .get('/api/articles?order=asc')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles[0].title).to.equal('Moustache');
            });
        });
        it('can take a sort_by and an order query', () => {
          return request
            .get('/api/articles?order=asc&sort_by=title')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles[0].title).to.equal('A');
              expect(body.articles[9].title).to.equal(
                "They're not exactly dogs, are they?",
              );
            });
        });
        it('will ignore an invalid sort_by query', () => {
          return request
            .get('/api/articles?sort_by=froggies')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles.length).to.equal(10);
              expect(body.articles[0].title).to.equal(
                'Living in the shadow of a great man',
              );
            });
        });
        it('article objects have a comment_count property', () => {
          return request
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles[0].title).equal(
                'Living in the shadow of a great man',
              );
              expect(body.articles[0].comment_count).to.equal('13');
            });
        });
      });
      it('status:405 invalid request method for end-point', () => {
        const methods = ['put', 'delete', 'patch'];
        const expectations = methods.map(method => request[method]('/api/articles').expect(405));
        return Promise.all(expectations);
      });
      // describe('(ADDITIONAL IF TIME) --> ', () => {
      //   it('responds with an array of 10 articles (DEFAULT limit=10)', () => {
      //     return request
      //       .get('/api/articles')
      //       .expect(200)
      //       .then(({ body }) => {
      //         expect(body.articles).to.have.length(10);
      //       });
      //   });
      //   it('takes an p query which alters the starting index of the articles returned (DEFAULT limit=10)', () => {
      //     return request
      //       .get('/api/articles?p=2')
      //       .expect(200)
      //       .then(({ body }) => {
      //         expect(body.articles[0].article_id).to.equal(11);
      //         expect(body.articles[0].title).to.equal('Am I a cat?');
      //       });
      //   });
      //   it('ignores malformed non-int limit/p queries', () => {
      //     const queries = ['?p=hiya', '?limit=hiya'];
      //     const expectations = queries.map(query => request.get(`/api/articles${query}`).expect(200));
      //     return Promise.all(expectations);
      //   });
      //   it('takes a limit query which alters the number of articles returned', () => {
      //     return request
      //       .get('/api/articles?limit=1')
      //       .expect(200)
      //       .then(({ body }) => {
      //         expect(body.articles.length).to.equal(1);
      //         expect(body.articles[0].title).to.equal('Living in the shadow of a great man');
      //       });
      //   });
      // });
    });
    describe('/articles/:article_id', () => {
      const url = '/api/articles/';
      it('GET status:200 responds with a single article object', () => {
        return request
          .get(url + 1)
          .expect(200)
          .then(({ body }) => {
            expect(body.article).to.have.all.keys([
              'article_id',
              'body',
              'author',
              'created_at',
              'votes',
              'topic',
              'comment_count',
              'title',
            ]);
            expect(body.article.article_id).to.equal(1);
            expect(body.article.title).to.equal(
              'Living in the shadow of a great man',
            );
          });
      });
      it('PATCH status:200 and an updated article when given a body including a valid "inc_votes" (VOTE UP)', () => {
        return request
          .patch(url + 1)
          .send({ inc_votes: 1 })
          .expect(200)
          .then(({ body }) => {
            expect(body.article.votes).to.equal(101);
          });
      });
      it('PATCH status:200 responds with an updated article when given a body including a valid "inc_votes" (VOTE DOWN)', () => {
        return request
          .patch(url + 1)
          .send({ inc_votes: -1 })
          .expect(200)
          .then(({ body }) => {
            expect(body.article.votes).to.equal(99);
          });
      });
      it('PATCH status:200s no body responds with an unmodified article', () => {
        return request
          .patch(url + 1)
          .expect(200)
          .then(({ body }) => {
            expect(body.article.votes).to.equal(100);
          });
      });
      it('DELETE status:204 and removes the article when given a valid article_id', () => {
        return request
          .delete(url + 1)
          .expect(204)
          .then(() => request.get(url + 1).expect(404));
      });
      it('DELETE responds with a 204 when deleting an article without comments (no comments required to perform delete)', () => request.delete(url + 2).expect(204));
      it('invalid methods respond with 405', () => {
        const methods = ['put', 'post'];
        const expectations = methods.map((method) => {
          return request[method](url + 1).expect(405);
        });
        return Promise.all(expectations);
      });
      describe('ERRORS', () => {
        it('GET status:404 url contains a non-existent (but potentially valid) article_id', () => {
          return request.get(url + 100).expect(404);
        });
        it('GET status:400 URL contains an invalid article_id', () => {
          return request.get(`${url}abc`).expect(400);
        });
        it('PATCH status:400 if given an invalid inc_votes', () => {
          return request
            .patch(url + 1)
            .send({ inc_votes: 'banana' })
            .expect(400);
        });
        it('DELETE status:404 when given a non-existent article_id', () => request.delete(url + 100).expect(404));
        it('DELETE responds with 400 on invalid article_id', () => request.delete(`${url}banana`).expect(400));
      });
    });

    describe('/api/articles/:article_id/comments', () => {
      describe('GET', () => {
        describe('(CORE TESTS) --> status:200', () => {
          it('responds with an array of comment objects', () => {
            return request
              .get('/api/articles/1/comments')
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.be.an('array');
                expect(body.comments[0]).to.have.all.keys([
                  'votes',
                  'comment_id',
                  'body',
                  'created_at',
                  'author',
                ]);
              });
          });
          it('sorts in the data (DEFAULT order=desc) and (DEFAULT sort_by=created_at)', () => {
            return request
              .get('/api/articles/1/comments')
              .expect(200)
              .then(({ body }) => {
                expect(body.comments[0].body).to.equal(
                  'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
                );
                expect(body.comments[9].body).to.equal(
                  'Ambidextrous marsupial',
                );
              });
          });
          it('can be sorted by author (DEFAULT order=desc)', () => {
            return request
              .get('/api/articles/1/comments?sort_by=author')
              .expect(200)
              .then(({ body }) => {
                expect(body.comments[0].author).to.equal('icellusedkars');
              });
          });
          it('can be sorted by votes (DEFAULT order=desc)', () => {
            return request
              .get('/api/articles/1/comments?sort_by=votes')
              .expect(200)
              .then(({ body }) => {
                expect(body.comments[0].votes).to.equal(100);
                expect(body.comments[9].votes).to.equal(0);
              });
          });
          it('can change the sort order (DEFAULT sort_by=created_at)', () => {
            return request
              .get('/api/articles/1/comments?order=asc')
              .expect(200)
              .then(({ body }) => {
                expect(body.comments[0].body).to.equal(
                  'This morning, I showered for nine minutes.',
                );
                expect(body.comments[9].body).to.equal(
                  'I hate streaming noses',
                );
              });
          });
        });
        describe('ERRORS', () => {
          it('responds with 404 for a non-existent article_id', () => {
            return request.get('/api/articles/100/comments').expect(404);
          });
          it('responds with 400 for an invalid article_id', () => {
            return request
              .get('/api/articles/barrymanilow/comments')
              .expect(400);
          });
        });
        // describe('(ADDITIONAL IF TIME) -->', () => {
        //   it('takes a limit query which alters the number of comments returned', () => {
        //     return request
        //       .get('/api/articles/1/comments?limit=5')
        //       .expect(200)
        //       .then(({ body }) => {
        //         expect(body.comments).to.have.length(5);
        //       });
        //   });
        //   it('takes a p query which alters the page of the comments returned', () => {
        //     return request
        //       .get('/api/articles/1/comments?p=2')
        //       .expect(200)
        //       .then(({ body }) => {
        //         expect(body.comments).to.have.length(3);
        //       });
        //   });
        //   it('responds with correct number of comments (DEFAULT limit=10)', () => {
        //     return request
        //       .get('/api/articles/1/comments')
        //       .expect(200)
        //       .then(({ body }) => {
        //         expect(body.comments).to.have.length(10);
        //       });
        //   });
        // });
      });
      describe('POST', () => {
        it('responds with a 201 and the posted comment when given a valid article_id', () => {
          return request
            .post('/api/articles/1/comments')
            .send({ body: 'test', username: 'butter_bridge' })
            .expect(201)
            .then(({ body }) => {
              expect(body.comment.body).to.equal('test');
              expect(body.comment.article_id).to.equal(1);
            });
        });
        it('responds with a 404 when given a non-existent article id', () => {
          return request
            .post('/api/articles/1000/comments')
            .send({ body: 'test', username: 'butter_bridge' })
            .expect(404);
        });
        it('responds with a 400 when given an invalid article id', () => {
          return request
            .post('/api/articles/cheesegrater/comments')
            .send({ body: 'test', user_id: 1 })
            .expect(400);
        });
        it('responds with a 400 when given an invalid body referencing a non-existent column', () => {
          return request
            .post('/api/articles/1/comments')
            .send({ body: 'test', user_id: 1, something_wrong: 'oops!' })
            .expect(400);
        });
        it('POST responds with a 422 when given a non-existent username', () => {
          return request
            .post('/api/articles/1/comments')
            .send({ body: 'test', username: 'elton john' })
            .expect(422);
        });
      });
      it('invalid methods respond with 405', () => {
        const url = '/api/articles/1/comments';
        const methods = ['patch', 'delete'];
        const expectations = methods.map(method => request[method](url).expect(405));
        return Promise.all(expectations);
      });
    });

    describe('comments/:comment_id', () => {
      it('PATCH status:200 and an updated comment when given a body including a valid "inc_votes" (VOTE DOWN)', () => {
        return request
          .patch('/api/comments/2')
          .send({ inc_votes: -1 })
          .expect(200)
          .then(({ body }) => {
            expect(body.comment.votes).to.equal(13);
          });
      });
      it('PATCH status:200 with no body responds with an unmodified comment', () => {
        return request
          .patch('/api/comments/2')
          .expect(200)
          .then(({ body }) => {
            expect(body.comment.votes).to.equal(14);
          });
      });
      it('PATCH status:400 if given an invalid inc_votes', () => {
        return request
          .patch('/api/comments/2')
          .send({ inc_votes: 'banana' })
          .expect(400);
      });
      it('PATCH status:404 non-existent comment_id is used', () => {
        return request.patch('/api/comments/1000').expect(404);
      });
      it('PATCH status:400 if invalid comment_id is used', () => {
        return request.patch('/api/comments/bananana').expect(400);
      });
      it('DELETE status:204 deletes the comment and responds with No Content', () => {
        return request.delete('/api/comments/2').expect(204);
      });
      it('DELETE status:404 client uses non-existent comment_id', () => {
        return request.delete('/api/comments/100').expect(404);
      });
      it('invalid methods respond with 405', () => {
        const url = '/api/comments';
        const methods = ['post', 'put'];
        const expectations = methods.map(method => request[method](`${url}/1`).expect(405));
        return Promise.all(expectations);
      });
    });
  });

  describe('/users', () => {
    const usersUrl = '/api/users';
    it('GET responds with a 200 and an array of user objects', () => {
      const jonny = {
        username: 'butter_bridge',
        name: 'jonny',
        avatar_url:
          'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
      };
      return request
        .get(usersUrl)
        .expect(200)
        .then(({ body }) => {
          expect(body.users).to.have.length(3);
          expect(body.users[0]).to.eql(jonny);
        });
    });
    it('invalid methods respond with 405', () => {
      const methods = ['put', 'patch', 'delete'];
      const expectations = methods.map((method) => {
        return request[method](usersUrl).expect(405);
      });
      return Promise.all(expectations);
    });
  });

  describe('/users/:username', () => {
    const userUrl = '/api/users/';
    it('GET status:200 responds with a user object when given a valid username', () => {
      const jonny = {
        username: 'butter_bridge',
        name: 'jonny',
        avatar_url:
          'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
      };
      return request
        .get(userUrl + jonny.username)
        .expect(200)
        .then(({ body }) => {
          expect(body.user).to.eql(jonny);
        });
    });
    it('GET status:404 when a non-existent username', () => request.get(`${userUrl} / blah`).expect(404));
    it('invalid methods respond with 405', () => {
      const methods = ['put', 'patch', 'delete'];
      const expectations = methods.map((method) => {
        return request[method](userUrl + 1).expect(405);
      });
      return Promise.all(expectations);
    });
  });
});
