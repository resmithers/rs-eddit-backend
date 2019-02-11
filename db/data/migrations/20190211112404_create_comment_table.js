
exports.up = function (knex, Promise) {
  console.log('Creating Comments Table');
  return knex.schema.createTable('comments', (userTable) => {
    userTable.increments('comment_id').primary();
    userTable.string('author').references('users.username');
    userTable.integer('article_id').references('articles.article_id');
    userTable.integer('votes').defaultTo(0);
    userTable.datetime('created_at').defaultTo(new Date().toISOString());
    userTable.text('body').notNullable();
  });
};

exports.down = function (knex, Promise) {
  console.log('Dropping Comments');
  return knex.schema.dropTable('comments');
};
