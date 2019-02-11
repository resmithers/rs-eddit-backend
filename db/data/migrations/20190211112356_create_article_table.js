
exports.up = function (knex, Promise) {
  console.log('Creating Article Table');
  return knex.schema.createTable('articles', (userTable) => {
    userTable.increments('article_id').primary();
    userTable.string('title').notNullable();
    userTable.text('body').notNullable();
    userTable.integer('votes').defaultTo(0);
    userTable.string('topic').references('topics.slug');
    userTable.string('author').references('users.username');
    userTable.datetime('created_at').defaultTo(new Date().toISOString());
  });
};

exports.down = function (knex, Promise) {
  console.log('Dropping Articles');
  return knex.schema.dropTable('articles');
};
