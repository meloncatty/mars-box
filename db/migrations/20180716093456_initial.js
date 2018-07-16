
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('mars-essentials', function(table) {
      table.increments('id').primary()
      table.string('item')
      table.boolean('is_packed')

      table.timestamps(true, true)
    })
  ])
}

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('mars-essentials')
  ])
}
