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
      res.status(400).send(`Error: ${error}`)
    })
})

app.listen(app.get('port'), () => {
  console.log(`Sever is running on port ${app.get('port')}.`)
})
