const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();

chai.use(chaiHttp); 

describe("Home", function() {
    it("should redirect to homepage", (done) => {
        chai.request(app)
            .get("/").redirects(0)
            .end((err, res) => {
                res.should.redirectTo('/login');
                done();
            });
    });
});

describe("Register", function() {
    it("should redirect to Register", (done) => {
      chai.request(app)
        .get("/register")
        .end((err, res) => {
          res.should.redirect;
          res.should.have.status(200);
          res.redirects.should.have.lengthOf(1);
          res.redirects[0].should.include("/register");
          done();
        });
    });
  });
  


describe("Login", function() {
    it("should redirect to Loging", (done) => {
        chai.request(app)
            .get("/login").redirects(0)
            .end((err, res) => {
                res.should.redirectTo('/login');
                done();
            });
    });
});

describe("About", function() {
    it("should redirect to About", (done) => {
        chai.request(app)
            .get("/about").redirects(0)
            .end((err, res) => {
                res.should.redirectTo('/about');
                done();
            });
    });
});

describe("Feedback", function() {
    it("should redirect to Feedback", (done) => {
        chai.request(app)
            .get("/feedback").redirects(0)
            .end((err, res) => {
                res.should.redirectTo('/feedback');
                done();
            });
    });
});

