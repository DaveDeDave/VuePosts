const request = require('supertest');
const app = require('../app.js');

let jwt;
let csrf_cookie;
let csrf_header;

/**
 * Get user gianni's jwt token and the csrf for the following tests
 */
before(function(done) {
  request(app)
    .post('/api/user/login')
    .send({
      username: 'gianni',
      password: 'VuePosts12.'
    })
    .end(function(err, res) {
      if(err) return done(err)
      jwt = res.headers['set-cookie'][0];
      request(app)
        .get('/api/xsrf-token')
        .end(function(err, res) {
          if(err) return done(err);
          csrf_header = res.body['xsrf-token'];
          csrf_cookie = res.headers['set-cookie'][0];
          done();
        });
    });
});

describe('Tests user API', function() {

  describe('GET /api/user/info', function() {
    it('should give the user informations (with authentication)', function(done) {
      request(app)
        .get('/api/user/info')
        .set('cookie', jwt)
        .expect(200, {
          username: 'gianni',
          name: 'Gianni',
          surname: 'Bicicletta',
          email: 'gianni.bicicletta@bike.com',
          registrationDate: '2020-5-11',
          job: 'Senior Developer',
          address: 'Rio De Janeiro',
          privateAccount: 0,
          nComments: 4,
          nPosts: 3
        }, done);
    });
    it('shouldn\'t give the user informations (without authentication)', function(done) {
      request(app)
        .get('/api/user/info')
        .expect(403, {
          code: 'AuthorizationRequired'
        }, done);
    });
  });

  describe('GET /api/user/info/:username', function() {
    it('Should return the informations for the user "gianni" (public account)', function(done) {
      request(app)
        .get('/api/user/info/gianni')
        .expect(200, {
          username: 'gianni',
          name: 'Gianni',
          surname: 'Bicicletta',
          email: 'gianni.bicicletta@bike.com',
          registrationDate: '2020-5-11',
          job: 'Senior Developer',
          address: 'Rio De Janeiro',
          privateAccount: 0,
          nComments: 4,
          nPosts: 3
        }, done);
    });
    it('Shouldn\'t return the informations for the user "carlo" (private account)', function(done) {
      request(app)
        .get('/api/user/info/carlo')
        .expect(200, {
          privateAccount: 1,
          nComments: 4,
          nPosts: 1
        }, done);
    });
    it('Shouldn\'t find the user "john"', function(done) {
      request(app)
        .get('/api/user/info/john')
        .expect(404, {
          code: "NotFound"
        }, done);
    });
  });

  describe('POST /api/user/info/update', function() {
    it('Should change the user information (with authentication)', function(done) {
      request(app)
        .post('/api/user/info/update')
        .set('cookie', `${jwt}; ${csrf_cookie}`)
        .set('XSRF-TOKEN', csrf_header)
        .send({
          name: 'Gianni',
          surname: 'Bicicletta',
          email: 'gianni@bike.com',
          registrationDate: '2020-5-11',
          job: 'Senior Developer',
          address: 'New York'
        })
        .expect(200, {
          code: 'Success'
        }).end(function(err, res) {
          if(err) return done(err);
          request(app)
            .get('/api/user/info')
            .set('cookie', jwt)
            .expect(200, {
              username: 'gianni',
              name: 'Gianni',
              surname: 'Bicicletta',
              email: 'gianni@bike.com',
              registrationDate: '2020-5-11',
              job: 'Senior Developer',
              address: 'New York',
              privateAccount: 0,
              nComments: 4,
              nPosts: 3
            }, done);
        });
    });
    it('Should return error 403 (without authentication)', function(done) {
      request(app)
        .post('/api/user/info/update')
        .send({
          name: 'John',
          privateAccount: 0
        })
        .expect(403, {
          code: 'AuthorizationRequired'
        }, done);
    });
  });

  describe('POST /api/user/password/update', function() {
    it('Should update the password', function(done) {
      request(app)
        .post('/api/user/password/update')
        .set('cookie', `${jwt}; ${csrf_cookie}`)
        .set('XSRF-TOKEN', csrf_header)
        .send({
          oldPassword: 'VuePosts12.',
          newPassword: 'VuePosts123.',
          newPasswordCheck: 'VuePosts123.'
        })
        .expect(200, {
          code: 'Success'
        }).end(function(err, res) {
          if(err) return done(err);
          request(app)
            .post('/api/user/login')
            .send({
              username: 'gianni',
              password: 'VuePosts123.'
            })
            .expect(200, {
              code: 'Success'
            }, done);
        });
    });
    it('Shouldn\'t update the password (EmptyFields)', function(done) {
      request(app)
        .post('/api/user/password/update')
        .set('cookie', `${jwt}; ${csrf_cookie}`)
        .set('XSRF-TOKEN', csrf_header)
        .send({
          oldPassword: 'VuePosts123.',
          newPassword: 'VuePosts12.',
          newPasswordCheck: ''
        })
        .expect(400, {
          code: 'EmptyFields'
        }, done);
    });
    it('Shouldn\'t update the password (DifferentPasswords)', function(done) {
      request(app)
        .post('/api/user/password/update')
        .set('cookie', `${jwt}; ${csrf_cookie}`)
        .set('XSRF-TOKEN', csrf_header)
        .send({
          oldPassword: 'VuePosts123.',
          newPassword: 'VuePosts12.',
          newPasswordCheck: 'VuePosts1234567.'
        })
        .expect(400, {
          code: 'DifferentPasswords'
        }, done);
    });
    it('Shouldn\'t update the password (WeakPassword)', function(done) {
      request(app)
        .post('/api/user/password/update')
        .set('cookie', `${jwt}; ${csrf_cookie}`)
        .set('XSRF-TOKEN', csrf_header)
        .send({
          oldPassword: 'VuePosts123.',
          newPassword: 'VuePosts12',
          newPasswordCheck: 'VuePosts12'
        })
        .expect(400, {
          code: 'WeakPassword'
        }, done);
    });
    it('Shouldn\'t update the password (WrongCredentials)', function(done) {
      request(app)
        .post('/api/user/password/update')
        .set('cookie', `${jwt}; ${csrf_cookie}`)
        .set('XSRF-TOKEN', csrf_header)
        .send({
          oldPassword: 'VuePosts12.',
          newPassword: 'VuePosts1234.',
          newPasswordCheck: 'VuePosts1234.'
        })
        .expect(403, {
          code: 'WrongCredentials'
        }, done);
    });
    it('Should return error 403 (without authentication)', function(done) {
      request(app)
        .post('/api/user/password/update')
        .send({
          oldPassword: 'VuePosts12.',
          newPassword: 'VuePosts1234.',
          newPasswordCheck: 'VuePosts1234.'
        })
        .expect(403, {
          code: 'AuthorizationRequired'
        }, done);
    });
  });

  describe('POST /api/user/register', function() {
    it('Should create a new account', function(done) {
      request(app)
        .post('/api/user/register')
        .send({
          username: 'robert',
          password: 'DifficultPassword1.',
          passwordCheck: 'DifficultPassword1.'
        })
        .end(function(err, res) {
          if(err) return done(err);
          request(app)
            .get('/api/user/info/robert')
            .expect(200, done);
        });
    });
    it('Shouldn\'t create a new account (EmptyFields)', function(done) {
      request(app)
        .post('/api/user/register')
        .send({
          username: 'Jack',
          password: 'DifficultPassword1.',
          passwordCheck: ''
        })
        .expect(400, {
          code: 'EmptyFields'
        }, done);
    });
    it('Shouldn\'t create a new account (DifferentPasswords)', function(done) {
      request(app)
        .post('/api/user/register')
        .send({
          username: 'Jack',
          password: 'DifficultPassword1.',
          passwordCheck: 'DifficultPassword2.'
        })
        .expect(400, {
          code: 'DifferentPasswords'
        }, done);
    });
    it('Shouldn\'t create a new account (WeakPassword)', function(done) {
      request(app)
        .post('/api/user/register')
        .send({
          username: 'Jack',
          password: 'DifficultPassword1',
          passwordCheck: 'DifficultPassword1'
        })
        .expect(400, {
          code: 'WeakPassword'
        }, done);
    });
    it('Shouldn\'t create a new account (UserAlreadyExists)', function(done) {
      request(app)
        .post('/api/user/register')
        .send({
          username: 'gianni',
          password: 'DifficultPassword1.',
          passwordCheck: 'DifficultPassword1.'
        })
        .expect(400, {
          code: 'UserAlreadyExists'
        }, done);
    });
  });

  describe('POST /api/user/login', function() {
    it('Should login succesfully', function(done) {
      request(app)
        .post('/api/user/login')
        .send({
          username: 'gianni',
          password: 'VuePosts123.'
        })
        .expect(200, {
          code: 'Success'
        })
        .end(function(err, res) {
          if(err) return done(err);
          if(res.headers['set-cookie'] == undefined || res.headers['set-cookie'][0].indexOf('au') == -1) {
            return done(new Error('jwt token didn\'t set after succesful login'));
          }
          done();
        });
    });
    it('Shouldn\'t login succesfully (EmptyFields)', function(done) {
      request(app)
        .post('/api/user/login')
        .send({
          username: 'gianni',
          password: ''
        })
        .expect(400, {
          code: 'EmptyFields'
        }, done)
    });
    it('Shouldn\'t login succesfully (WrongCredentials)', function(done) {
      request(app)
        .post('/api/user/login')
        .send({
          username: 'gianni',
          password: 'aaa'
        })
        .expect(403, {
          code: 'WrongCredentials'
        }, done)
    });
  });

  describe('POST /api/user/delete', function() {
    let jwt_del;
    let csrf_cookie_del;
    let csrf_header_del;
  
    /**
     * Get user robert's jwt token and the csrf for the following tests
     */
    before(function(done) {
      request(app)
      .post('/api/user/login')
      .send({
        username: 'robert',
        password: 'DifficultPassword1.'
      })
      .end(function(err, res) {
        if(err) return done(err)
        jwt_del = res.headers['set-cookie'][0];
        request(app)
          .get('/api/xsrf-token')
          .end(function(err, res) {
            if(err) return done(err);
            csrf_header_del = res.body['xsrf-token'];
            csrf_cookie_del = res.headers['set-cookie'][0];
            done();
          });
      });
    });

    it('Should delete the user', function(done) {
      request(app)
        .post('/api/user/delete')
        .set('cookie', `${jwt_del}; ${csrf_cookie_del}`)
        .set('XSRF-TOKEN', csrf_header_del)
        .expect(200, {
          code: 'Success'
        })
        .end(function(err, res) {
          if(err) return done(err);
          request(app)
            .get('/api/user/info/robert')
            .expect(404, {
              code: 'NotFound'
            }, done);
        });
    });
    it('Should return error 403 (without authentication)', function(done) {
      request(app)
        .post('/api/user/delete')
        .expect(403, {
          code: 'AuthorizationRequired'
        }, done);
    });
  });

});