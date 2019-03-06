
exports.up = function (knex, Promise) {
  // console.log('Creating Article Table');
  return knex.schema.createTable('articles', (articleTable) => {
    articleTable.increments('article_id').primary();
    articleTable.string('title').notNullable();
    articleTable.text('body').notNullable();
    articleTable.integer('votes').defaultTo(0);
    articleTable.string('topic').references('topics.slug');
    articleTable.string('author').references('users.username');
    articleTable.datetime('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex, Promise) {
  // console.log('Dropping Articles');
  return knex.schema.dropTable('articles');
};
