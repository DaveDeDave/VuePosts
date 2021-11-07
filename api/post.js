const express = require('express');
const db = require('../db/db');
const auth = require('../middleware/auth');
const router = express.Router();

const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const DOMPurify = createDOMPurify(new JSDOM('').window);
const ALLOWED_TAGS = ['p', 'strong', 'em', 's', 'mark', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'pre', 'code', 'hr', 'br', 'blockquote'];

/**
 * POST /api/post/new
 * Post fields:
 * - {String} title
 * - {String} content
 * Possible error codes:
 * - EmptyFields
 * - AuthorizationRequired
 * On success creates the new post
 */
 router.post('/new', auth.required, (req, res, next) => {
  const { title, content } = req.body;

  if(!title || !content) {
    return next({name: 'EmptyFields'});
  }

  const sanitizedContent = DOMPurify.sanitize(content, {ALLOWED_TAGS});

  db.createPost({title, content: sanitizedContent, author: req.user.username}).then(() => {
    res.send({code: 'Success'});
  }).catch(e => next(e));
});

/**
 * POST /api/post/delete
 * Post fields:
 * - {Number} id
 * Possible error codes:
 * - NotFound
 * - AuthorizationRequired
 * On success deletes the specified post
 */
router.post('/delete', auth.required, (req, res, next) => {
  const { id } = req.body;

  db.deletePost({id, username: req.user.username}).then(() => {
    res.send({code: 'Success'});
  }).catch(e => next(e));
});

/**
 * GET /api/post/getAll
 * Query fields:
 * - {String} search
 * - {Number} page
 * - {Number} nResults
 * On success returns all posts for that page
 */
router.get('/getAll', auth.optional, (req, res, next) => {
  const { search, page, nResults } = req.query;
  const filter = `%${search}%`;
  
  db.getAllPosts({search: filter, number: page, nResults}).then(async (posts) => {
    for(let post of posts) {
      post.nComments = await db.getNumberOfCommentsByPost({id: post.id}).catch(e => next(e));
      post.owner = req.user ? req.user.username == post.author : false;
    }
    res.send({posts});
  }).catch(e => next(e));
});

/**
 * GET /api/post/get
 * Query fields:
 * - {Number} id
 * Possible error codes:
 * - NotFound
 * On success returns the informations of the specified post
 */
router.get('/get', auth.optional, (req, res, next) => {
  const { id } = req.query;

  db.getPost({id}).then(async (post) => {
    post.nComments = await db.getNumberOfCommentsByPost({id: post.id}).catch(e => next(e));
    post.owner = req.user ? req.user.username == post.author : false;
    res.send(post);
  }).catch(e => next(e));
});

/**
 * GET /api/post/getNumber
 * Query fields:
 * - {String} search
 * On success returns the total number of posts
 */
router.get('/getNumber', auth.optional, (req, res, next) => {
  const { search } = req.query;
  const filter = `%${search}%`;

  db.getNumberOfPosts(filter).then((nPosts) => {
    res.send({nPosts: nPosts});
  }).catch(e => next(e));
});

module.exports = router;