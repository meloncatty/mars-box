const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)

app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))

app.set('port', process.env.PORT || 3000)

app.get('/', (req, res) => {
  res.send('Connected to server!')
})

app.get('/api/v1/essentials', (req, res) => {
  database('mars-essentials').select()
    .then(items => {
      res.status(200).json(items)
    })
    .catch(error => {
      res.status(400).json(`Error: ${error}`)
    })
})

app.post('/api/v1/essentials', (req, res) => {
  database('mars-essentials').insert(req.body)
    .then(() => {
      database('mars-essentials').where('item', req.body.item).select()
        .then(item => res.status(200).json(item))
    })
    .catch(error => {
      res.status(400).send('Please include a valid request body')
    })
})

app.patch('/api/v1/essentials/:id', (req, res) => {
  const { id } = req.params

  database('mars-essentials').where('id', id).select().update(req.body)
    .then(() => res.status(200).send('Item updated!'))
    .catch(error => res.status(400).send('Please provide a valid id to update'))
})

function verifyDelete (req, res, next) {
  const { id } = req.params

  database('mars-essentials').where('id', id)
    .then(item => {
      if (!item.length) {
        res.status(400).send(`Could not find item with id ${id}`)
      } else {
        next()
      }
    })
    .catch(error => {
      res.status(400).json(`Error: ${error}`)
    })
}

app.delete('/api/v1/essentials/:id', verifyDelete, (req, res) => {
  const { id } = req.params

  database('mars-essentials').where('id', id).select().del()
    .then(item => {
      res.status(201).send('Item deleted!')
    })
    .catch(error => {
      console.log(error)
      res.status(400).json(`Error: ${error}`)
    })
})

app.listen(app.get('port'), () => {
  console.log(`Sever is running on port ${app.get('port')}.`)
})

module.exports = app
