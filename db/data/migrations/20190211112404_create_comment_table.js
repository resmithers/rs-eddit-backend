
exports.up = function (knex, Promise) {
  // console.log('Creating Comments Table');
  return knex.schema.createTable('comments', (commentTable) => {
    commentTable.increments('comment_id').primary();
    commentTable.string('author').references('users.username');
    commentTable.integer('article_id').references('articles.article_id').onDelete('CASCADE');
    commentTable.integer('votes').defaultTo(0);
    commentTable.datetime('created_at').defaultTo(new Date().toISOString());
    commentTable.text('body').notNullable();
  });
};

exports.down = function (knex, Promise) {
  // console.log('Dropping Comments');
  return knex.schema.dropTable('comments');
};
