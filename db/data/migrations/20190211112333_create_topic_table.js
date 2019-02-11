
exports.up = function (knex, Promise) {
  // console.log('Creating Topic Table');
  return knex.schema.createTable('topics', (topicTable) => {
    topicTable.string('slug').primary();
    topicTable.string('description').notNullable();
  });
};

exports.down = function (knex, Promise) {
  // console.log('Dropping Topics');
  return knex.schema.dropTable('topics');
};
