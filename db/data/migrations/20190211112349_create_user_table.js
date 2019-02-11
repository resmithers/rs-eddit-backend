
exports.up = function (knex, Promise) {
  // console.log('Creating User Table');
  return knex.schema.createTable('users', (userTable) => {
    userTable.string('username').primary();
    userTable.string('name').notNullable();
    userTable.string('avatar_url').notNullable();
  });
};

exports.down = function (knex, Promise) {
  // console.log('Dropping Users');
  return knex.schema.dropTable('users');
};
