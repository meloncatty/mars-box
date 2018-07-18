const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
const server = require('../server')
const environment = process.env.NODE_ENV || 'test'
const configuration = require('../knexfile')[environment]
const knex = require('knex')(configuration)
chai.use(chaiHttp)

describe('Client routes', () => {
  it('should return status 200', done => {
    chai.request(server)
      .get('/')
      .end((err, response) => {
        response.should.have.status(200)
        done()
      })
  })
  it('should return 404 with bad url', done => {
    chai.request(server)
      .get('/api/v1/badpath')
      .end((err, response) => {
        response.should.have.status(404)
        done()
      })
  })
})

describe('API routes', () => {
  beforeEach((done) => {
    knex.migrate.rollback()
      .then(() => {
        knex.migrate.latest()
          .then(() => {
            return knex.seed.run()
              .then(() => {
                done()
              })
          })
      })
      .catch(error => {
        throw error
      })
  })

  describe('GET /api/v1/essentials', () => {
    it('should return all essentials', done => {
      chai.request(server)
        .get('/api/v1/essentials')
        .end((err, response) => {
          response.should.have.status(200)
          response.should.be.json
          response.body.should.be.a('array')
          response.body[0].should.have.property('item')
          response.body[0].item.should.equal('oxygen tank')
          response.body[0].should.have.property('is_packed')
          response.body[0].is_packed.should.equal(true)
          done()
        })
    })
  })

  describe('POST /api/v1/essentials', () => {
    it('should return new item id', done => {
      chai.request(server)
        .post('/api/v1/essentials')
        .send({
          'item': 'solar cells',
          'is_packed': false,
          'id': Math.floor((Math.random() * 1000))
        })
        .end((err, response) => {
          response.should.have.status(201)
          response.body[0].should.have.property('item')
          response.body[0].item.should.equal('solar cells')
          response.body[0].should.have.property('is_packed')
          response.body[0].is_packed.should.equal(false)
          done()
        })
    })

    it('should return status 422 when invalid request body', done => {
      chai.request(server)
        .post('/api/v1/essentials')
        .send({
          'item': 'solar cells',
          'is_packed': false
        })
        .end((err, response) => {
          response.should.have.status(422)
          response.res.text.should.equal('Please include a valid request body')
          done()
        })
    })
  })

  describe('PATCH /api/v1/essentials/:id', () => {
    it('should return success text when successful', done => {
      chai.request(server)
        .patch('/api/v1/essentials/2')
        .send({
          'is_packed': false
        })
        .end((err, response) => {
          response.should.have.status(200)
          response.res.text.should.equal('Update successful!')
          done()
        })
    })

    it('should return status 422 with bad request', done => {
      chai.request(server)
        .patch('/api/v1/essentials/2')
        .send({
          'is_not_packed': true
        })
        .end((err, response) => {
          response.should.have.status(422)
          response.res.text.should.equal('Please include a valid request body')
          done()
        })
    })
  })

  describe('DELETE /api/v1/essentials/:id', () => {
    it('should return status 204 when successful', done => {
      chai.request(server)
        .delete('/api/v1/essentials/1')
        .end((err, response) => {
          response.should.have.status(204)
          done()
        })
    })

    it('should return status 400 when unsuccessful', done => {
      chai.request(server)
        .delete('/api/v1/essentials/90')
        .end((err, response) => {
          response.should.have.status(404)
          response.res.text.should.equal('Could not find item with id 90')
          done()
        })
    })
  })
})
