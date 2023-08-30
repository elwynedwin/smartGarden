const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const app = require('../app');


should = chai.should();

chai.use(chaiHttp);

describe('POST /login', () => {
  it('should login a user and redirect to the homepage', (done) => {
    const userData = {
      email: 'testchai@gmail.com',
      password: 'TestChai!1',
    };

    chai.request(app)
      .post("/auth/login")
      .send(userData)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
});


describe('POST /register', () => {
    it('should register a user and redirect to the login page', (done) => {
      const userData = {
        name: 'example123',
        email: 'qexample123@gmail.com',
        password: 'TestChai!1',
        passwordConfirm:'TestChai!1'
      };
  
      chai.request(app)
        .post("/auth/register")
        .send(userData)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          res.should.have.status(200);
          res.body.should.be.a('object');
          //expect(res).to.redirectTo('/');
          done();
        });
    });
  });