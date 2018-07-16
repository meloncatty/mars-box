const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)

app.set('port', process.env.PORT || 3000)

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
  res.send('Connected to server!')
})

app.listen(app.get('port'), () => {
  console.log(`Sever is running on port ${app.get('port')}.`)
})
