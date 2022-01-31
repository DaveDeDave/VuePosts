const express = require('express');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });
const Database = require('../db/db');
const db = new Database();
const auth = require('../middleware/auth');
const router = express.Router();

const isPasswordStrong = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!-\/ ||:-@ || [-` || {-~])(?=.{6,})/;

/**
 * GET /api/user/info
 * Possible error codes:
 * - AuthorizationRequired
 * On success returns the information of the logged user
 */
router.get('/info', auth.required, (req, res, next) => {
  db.getUserInfo({username: req.user.username, owner: true}).then(userInfo => {
    db.getNumberOfPostsByUser({username: req.user.username}).then(nPosts => {
      db.getNumberOfCommentsByUser({username: req.user.username}).then(nComments => {
        userInfo.nPosts = nPosts;
        userInfo.nComments = nComments;
        res.send(userInfo);
      }).catch(e => next(e));
    }).catch(e => next(e));
  }).catch(e => next(e));
});

/**
 * GET /api/user/info/:username
 * Url params:
 * - {string} username
 * Possible error codes:
 * - NotFound
 * On success returns the information of the specified user
 */
router.get('/info/:username', auth.optional, (req, res, next) => {
  if(req.user && req.user.username == req.params.username) {
    return res.send({redirect: true});
  }

  db.getUserInfo({username: req.params.username, owner: false}).then(userInfo => {
    db.getNumberOfPostsByUser({username: req.params.username}).then(nPosts => {
      db.getNumberOfCommentsByUser({username: req.params.username}).then(nComments => {
        userInfo.nPosts = nPosts;
        userInfo.nComments = nComments;
        return res.send(userInfo);
      }).catch(e => next(e));
    }).catch(e => next(e));
  }).catch(e => next(e));
});

/**
 * POST /api/user/info/update
 * Post fields:
 * - {String} name
 * - {String} surname
 * - {String} email
 * - {String} job
 * - {String} address
 * - {Boolean} privateAccount
 * Possible error codes:
 * - AuthorizationRequired
 * On success update the user's informations
 */
router.post('/info/update', csrfProtection, auth.required, (req, res, next) => {
  const { name, surname, email, job, address, privateAccount } = req.body;

  db.updateUserInfo({username: req.user.username, name, surname, email, job, address, privateAccount}).then(() => {
    res.send({code: 'Success'});
  }).catch(e => next(e));
});

/**
 * POST /api/user/password/update
 * Post fields:
 * - {String} oldPassword
 * - {String} newPassword
 * - {String} newPasswordCheck
 * Possible error codes:
 * - AuthorizationRequired
 * - EmptyFields
 * - DifferentPasswords
 * - WeakPassword
 * - WrongCredentials
 * On success update the user's password
 */
router.post('/password/update', csrfProtection, auth.required, (req, res, next) => {
  const { oldPassword, newPassword, newPasswordCheck } = req.body;

  if(!oldPassword || !newPassword || !newPasswordCheck) {
    return next({name: 'EmptyFields'});
  } else if(newPassword != newPasswordCheck) {
    return next({name: 'DifferentPasswords'});
  } else if(!isPasswordStrong.test(newPassword)) {
    return next({name: 'WeakPassword'});
  }

  db.updateUserPassword({username: req.user.username, oldPassword, newPassword}).then(() => {
    res.send({code: 'Success'});
  }).catch(e => next(e));
});

/**
 * POST /api/user/register
 * Post fields:
 * - {String} username
 * - {String} password
 * - {String} passwordCheck
 * Possible error codes:
 * - EmptyFields
 * - DifferentPasswords
 * - WeakPassword
 * - UserAlreadyExists
 * On success set the authentication cookie
 */
 router.post('/register', auth.optional, (req, res, next) => {
  const { username, password, passwordCheck } = req.body

  if(!username || !password || !passwordCheck) {
    return next({name: 'EmptyFields'});
  } else if(password != passwordCheck) {
    return next({name: 'DifferentPasswords'});
  } else if(!isPasswordStrong.test(password)) {
    return next({name: 'WeakPassword'});
  }

  db.createUser({username, password}).then(token => {
    res.cookie('au', token, {
      sameSite: 'Strict'
    }).send({code: 'Success'});
  }).catch(e => next(e));
});

/**
 * POST /api/user/login
 * Post fields:
 * - {String} username
 * - {String} password
 * Possible error codes:
 * - EmptyFields
 * - WrongCredentials
 * On success set the authentication cookie
 */
router.post('/login', auth.optional, (req, res, next) => {
  const { username, password } = req.body;

  if(!username || !password) {
    return next({name: 'EmptyFields'});
  }

  db.authenticateUser({username, password}).then(token => {
    res.cookie('au', token, {
      sameSite: 'Strict'
    }).send({code: 'Success'});
  }).catch(e => next(e));
});

/**
 * POST /api/user/delete
 * Possible error codes:
 * - AuthorizationRequired
 * On success remove the authentication cookie
 */
router.post('/delete', csrfProtection, auth.required, (req, res, next) => {
  db.deleteUser({username: req.user.username}).then(() => {
    res.clearCookie('au');
    res.send({code: 'Success'});
  }).catch(e => next(e));
});

module.exports = router;