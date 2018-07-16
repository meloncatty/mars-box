process.env.NODE_ENV = 'test'
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
})
