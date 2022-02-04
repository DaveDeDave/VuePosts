const authController = require('../controllers/authController');
const Database = require('../db/db');
const db = new Database(process.env.TEST);

const getToken = (req) => {
  if(req.cookies.au) {
      return req.cookies.au;
  } else {
    return null;
  }
}

module.exports = {
  required(req, res, next) {
    const token = getToken(req);
      
    if(!token) {
      return next({'name': 'AuthorizationRequired'});
    } else {
      authController.verifyJWT(token).then((result) => {
        db.getUserInfo(result).then(user => {
          req.user = result;
          next();
        }).catch(e => {
          if(e.name == 'UserNotFound') {
            res.clearCookie('au');
            next({'name': 'AuthorizationRequired'});
          } else {
            next(e);
          }
        });
      }).catch(e => {
        res.clearCookie('au');
        next({'name': 'AuthorizationRequired'});
      });
    }
  },
  optional(req, res, next) {
    const token = getToken(req);
    
    if(!token)
      return next();
    else {
      authController.verifyJWT(token).then((result) => {
        db.getUserInfo(result).then(user => {
          req.user = result;
          next();
        }).catch(e => {
          if(e.name == 'UserNotFound') {
            res.clearCookie('au');
            next();
          } else {
            next(e);
          }
        });
      }).catch(e => {
        res.clearCookie('au');
        next();
      });
    }
  }
};