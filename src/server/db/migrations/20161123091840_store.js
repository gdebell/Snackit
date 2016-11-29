
exports.up = function(knex, Promise) {
  return knex.schema.createTable('store', function (table) {
    table.increments();
    table.string('name').notNullable();
    table.string('address').notNullable();
    table.string('city').notNullable();
    table.string('state').notNullable();
    table.integer('zip').notNullable();
    table.string('lat');
    table.string('long');
    table.string('note');
  });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('store');
  };
