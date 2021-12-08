const error_400 = [
  'EmptyFields',
  'DifferentPasswords',
  'WeakPassword',
  'UserAlreadyExists'
];

const error_403 = [
  'WrongCredentials',
  'AuthorizationRequired'
];

const error_404 = [
  'NotFound'
];

module.exports = (err, req, res, next) => {
  if(err.name == 'ForbiddenError') {
    err.name = 'AuthorizationRequired';
  }

  if(error_400.includes(err.name)) {
    res.status(400).send({code: err.name});
  } else if(error_403.includes(err.name)) {
    res.status(403).send({code: err.name});
  } else if(error_404.includes(err.name)) {
    res.status(404).send({code: err.name});
  } else {
    console.log(err, '|-|', err.name, '|-|', err.message, '|-|', err.stack);
    res.status(500).send({code: "UnknownError"});
  }
}