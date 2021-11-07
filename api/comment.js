const express = require('express');
const db = require('../db/db');
const auth = require('../middleware/auth');
const router = express.Router();

const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const DOMPurify = createDOMPurify(new JSDOM('').window);
const ALLOWED_TAGS = ['p', 'strong', 'em', 's', 'mark', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'pre', 'code', 'hr', 'br', 'blockquote'];

/**
 * POST /api/comment/new
 * Post fields:
 * - {Number} postID
 * - {String} comment
 * Possible error codes:
 * - EmptyFields
 * - NotFound
 * - AuthorizationRequired
 * On success creates the new comment
 */
 router.post('/new', auth.required, (req, res, next) => {
  const { postID, comment } = req.body;
  
  if(!comment) {
    return next({name: 'EmptyFields'});
  }

  const sanitizedComment = DOMPurify.sanitize(comment, {ALLOWED_TAGS});

  db.createComment({postID, text: sanitizedComment, author: req.user.username}).then(() => {
    res.send({code: 'Success'});
  }).catch(e => next(e));
});

/**
 * POST /api/comment/delete
 * Post fields:
 * - {Number} id
 * Possible error codes:
 * - NotFound
 * - AuthorizationRequired
 * On success deletes the specified comment
 */
router.post('/delete', auth.required, (req, res, next) => {
  const { id } = req.body;

  db.deleteComment({id, username: req.user.username}).then(() => {
    res.send({code: 'Success'});
  }).catch(e => next(e));
});

/**
 * GET /api/comment/getAll
 * Query fields:
 * - {Number} postID
 * - {Number} page
 * - {Number} nResults
 * On success returns all the comments for that page
 */
router.get('/getAll', auth.optional, (req, res, next) => {
  const { postID, page, nResults } = req.query;
  
  db.getAllComments({id: postID, commentPage: page, nResults}).then(comments => {
    for(let comment of comments) {
      comment.owner = req.user ? req.user.username == comment.author : false;
    }
    res.send({comments});
  }).catch(e => next(e));
});

module.exports = router;