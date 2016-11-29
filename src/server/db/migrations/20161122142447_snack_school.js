
exports.up = function(knex, Promise) {
  return knex.schema.createTable('school', function (table) {
    table.increments();
    table.string('name').notNullable();
    table.string('address').notNullable();
    table.string('city').notNullable();
    table.string('state').notNullable();
    table.integer('zip').notNullable();
    table.string('lat');
    table.string('long');
    table.string('photo_url');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('school');
};
