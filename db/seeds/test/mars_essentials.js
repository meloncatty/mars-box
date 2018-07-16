exports.seed = function (knex, Promise) {
  return knex('mars-essentials').del()
    .then(function () {
      return knex('mars-essentials').insert([
        {id: 1, item: 'oxygen tank', is_packed: true},
        {id: 2, item: 'protein bars', is_packed: false},
        {id: 3, item: 'thermal blanket', is_packed: false},
        {id: 4, item: 'drone', is_packed: true}
      ])
    })
    .then(function () {
      console.log('Seeding complete!')
    })
    .catch(function (error) {
      console.log(`Error seeding data: ${error}`)
    })
}
