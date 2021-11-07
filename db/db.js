const sqlite3 = require('sqlite3');
const argon2 = require('argon2');
const authController = require('../controllers/authController');
const fs = require('fs');

/**
 * Gets a sqlite3 db instance with integrity constraints
 * @returns {sqlite3.Database} sqlite3 db instance
 */
const getDBInstance = () => {
  const db = new sqlite3.Database('./db/db.sqlite');
  db.run('PRAGMA foreign_keys = ON');
  
  return db;
}

module.exports = {
  /**
   * Initializes the database if it doesn't exist
   */
  async init() {
    fs.access('./db/db.sqlite', (err) => {
      if(err) {
        const db = getDBInstance();
        const schema = fs.readFileSync('./db/schema.sql', 'utf8');
        db.exec(schema, (err) => {
          if(err)
            console.log(err)
          const inputs = fs.readFileSync('./db/inputs.sql', 'utf8');
          db.exec(inputs, (err) => {
            if(err)
              console.log(err);
            db.close();
          });
        });
      }
    });
  },
  /**
   * Registers a new user
   * @param {Object} user
   * @property {String} username - The user's username
   * @property {String} password - The user's password
   * @returns {Promise<String>} JWT token
   */
  async createUser(user) {
    const db = getDBInstance();
    try {
      const hash = await argon2.hash(user.password);

      const date = new Date();
      const registrationDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

      return new Promise((resolve, reject) => {
        db.run("INSERT INTO user VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", user.username, hash, '', '', '', registrationDate, '', '', false, (err) => {
          db.close();
          if(err) {
            if(err.message == 'SQLITE_CONSTRAINT: UNIQUE constraint failed: user.username') {
              reject({name: 'UserAlreadyExists'});
            } else {
              reject(err);
            }
          } else {
            authController.generateJWT({username: user.username}).then(token => {
              resolve(token)
            }).catch(e => {
              reject(e);
            });
          }
        });
      });

    } catch(e) {
      throw new Error(e);
    }
  },
  /**
   * Tries to authenticate the user
   * @param {Object} user
   * @property {String} username - The user's username
   * @property {String} password - The user's password
   * @returns {Promise<String>} JWT token
   */
  async authenticateUser(user) {
    const db = getDBInstance();

    return new Promise((resolve, reject) => {
      db.get("SELECT password FROM user WHERE username = ?", user.username, async (err, row) => {
        db.close();
        if(err) {
          reject(err);
        } else if(!row) {
          reject({name: 'WrongCredentials'});
        } else {
          try {
            if(await argon2.verify(row.password, user.password)) {
              authController.generateJWT({username: user.username}).then(token => {
                resolve(token)
              }).catch(e => {
                reject(e);
              });
            } else {
              reject({name: 'WrongCredentials'});
            }
          } catch(err) {
            reject(err);
          }
        }
      });
    });
  },
  /**
   * Deletes a user
   * @param {Object} user
   * @property {String} username - The user's username
   */
  deleteUser(user) {
    const db = getDBInstance();

    return new Promise((resolve, reject) => {
      db.run("DELETE FROM user WHERE username = ?", user.username, (err) => {
        db.close();
        if(err) {
          reject(err);
        } else {
          resolve();
        }
      })
    });
  },
  /**
   * Gets user's personal informations
   * @param {Object} user
   * @property {String} username - The user's username
   * @property {Boolean} owner - Check if the user who require the informarions is the owner of the account 
   * @returns {Promise<Object>} User's informations
   */
  getUserInfo(user) {
    const db = getDBInstance();

    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM user WHERE username = ?", user.username, (err, row) => {
        db.close();
        if(err) {
          reject(err);
        } else if(!row) {
          reject({name: 'NotFound'});
        } else if(!row.privateAccount || user.owner) {
          resolve({
            username: row.username,
            name: row.name,
            surname: row.surname,
            email: row.email,
            registrationDate: row.registrationDate,
            job: row.job,
            address: row.address,
            privateAccount: row.privateAccount
          });
        } else {
          resolve({
            privateAccount: row.privateAccount
          })
        }
      });
    });
  },
  /**
   * Updates user's personal informations
   * @param {Object} user
   * @property {String} username - The user's username
   * @property {String} name - The user's name
   * @property {String} surname - The user's surname
   * @property {String} email - The user's email
   * @property {String} job - The user's job
   * @property {String} address - The user's address
   * @property {Boolean} privateAccount - If the account is private or not
   */
  updateUserInfo(user) {
    const db = getDBInstance();
    
    return new Promise((resolve, reject) => {
      db.run("UPDATE user SET name = ?, surname = ?, email = ?, job = ?, address = ?, privateAccount = ? WHERE username = ?", user.name, user.surname, user.email, user.job, user.address, user.privateAccount, user.username, (err) => {
        db.close();
        if(err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  },
  /**
   * Updates user's password
   * @param {Object} user
   * @property {String} username - The user's username
   * @property {String} oldPassword - The user's old password
   * @property {String} newPassword - The user's new password
   */
  updateUserPassword(user) {
    const db = getDBInstance();

    return new Promise((resolve, reject) => {
      db.get("SELECT password FROM user WHERE username = ?", user.username, async (err, row) => {
        if(err) {
          db.close();
          reject(err);
        } else if(!row) {
          db.close();
          reject({name: 'WrongCredentials'});
        } else {
          try {
            if(await argon2.verify(row.password, user.oldPassword)) {
              const hash = await argon2.hash(user.newPassword);
              db.run("UPDATE user SET password = ? WHERE username = ?", hash, user.username, (err) => {
                db.close();
                if(err) {
                  reject(err);
                } else {
                  resolve();
                }
              })
            } else {
              db.close();
              reject({name: 'WrongCredentials'});
            }
          } catch(err) {
            db.close();
            reject(err);
          }
        }
      });
    });
  },
  /**
   * Creates a new post
   * @param {Object} post
   * @property {String} title - The post's title
   * @property {String} content - The post's content
   * @property {String} author - The author's username
   */
  createPost(post) {
    const db = getDBInstance();

    return new Promise((resolve, reject) => {
      db.run("INSERT INTO post (title, content, author) VALUES (?, ?, ?)", post.title, post.content, post.author, (err) => {
        db.close();
        if(err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  },
  /**
   * Deletes a post by id
   * @param {Object} post
   * @property {Number} id - The post's id
   * @property {String} username - The user who requested to delete the post
   */
  deletePost(post) {
    const db = getDBInstance();

    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM post WHERE id = ?", post.id, (err, row) => {
        if(err) {
          db.close();
          reject(err);
        } else if(!row) {
          db.close();
          reject({name: 'NotFound'});
        } else if(row.author != post.username) {
          reject({name: 'AuthorizationRequired'});
        } else {
          db.run("DELETE FROM post WHERE id = ?", post.id, (err) => {
            db.close();
            if(err) {
              reject(err);
            } else {
              resolve();
            }
          });
        }
      });
    });
  },
  /**
   * Gets all posts of a page
   * @param {Object} page - The page
   * @property {String} search - The search filter by title 
   * @property {Number} number - The page number
   * @property {Number} nResults - The number of posts that will be returned for that page
   * @returns {Promise<Object[]>} List of posts
   */
  getAllPosts(page) {
    const db = getDBInstance();

    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM post WHERE title LIKE ? LIMIT ? OFFSET ?", page.search, page.nResults, (page.number-1)*page.nResults, (err, rows) => {
        db.close();
        if(err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },
  /**
   * Gets a post by id
   * @param {Object} post
   * @property {Number} id - The post's id
   * @returns {Promise<Object>} The post
   */
  getPost(post) {
    const db = getDBInstance();

    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM post WHERE id = ?", post.id, (err, row) => {
        db.close();
        if(err) {
          reject(err);
        } else if(!row) {
          reject({name: 'NotFound'});
        } else {
          resolve(row);
        }
      });
    });
  },
  /**
   * Gets the total number of posts
   * @param {String} search - The search filter by title
   * @returns {Promise<Number>} The number of posts
   */
  getNumberOfPosts(search) {
    const db = getDBInstance();

    return new Promise((resolve, reject) => {
      db.get("SELECT COUNT(*) AS nPosts FROM post WHERE title LIKE ?", search, (err, row) => {
        db.close();
        if(err) {
          reject(err);
        } else if(!row) {
          resolve(0);
        } else {
          resolve(row.nPosts);
        }
      })
    });
  },
  /**
   * Gets the number of posts of a user
   * @param {Object} user
   * @property {String} username
   * @returns {Promise<Number>} The number of posts of the user
   */
  getNumberOfPostsByUser(user) {
    const db = getDBInstance();

    return new Promise((resolve, reject) => {
      db.get("SELECT COUNT(*) AS nPosts FROM post WHERE author = ?", user.username, (err, row) => {
        db.close();
        if(err) {
          reject(err);
        } else if(!row) {
          resolve(0);
        } else {
          resolve(row.nPosts);
        }
      })
    });
  },
  /**
   * Comments a post
   * @param {Object} comment
   * @property {Number} postID - The post's id
   * @property {String} text - The comment
   * @property {String} author - The comment's author
   */
  createComment(comment) {
    const db = getDBInstance();

    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM post WHERE id = ?", comment.postID, (err, row) => {
        if(err) {
          db.close();
          reject(err);
        } else if(!row) {
          db.close();
          reject({name: 'NotFound'});
        } else {
          db.run("INSERT INTO comment (content, post, author) VALUES (?, ?, ?)", comment.text, comment.postID, comment.author, (err) => {
            db.close();
            if(err) {
              reject(err)
            } else {
              resolve();
            }
          });
        }
      })
    });
  },
  /**
   * Deletes a comment by id
   * @param {Object} comment
   * @property {Number} id - The comment's id
   * @property {String} username - The user who requested to delete the comment
   */
  deleteComment(comment) {
    const db = getDBInstance();

    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM comment WHERE id = ?", comment.id, (err, row) => {
        if(err) {
          db.close();
          reject(err);
        } else if(!row) {
          db.close();
          reject({name: 'NotFound'});
        } else if(row.author != comment.username) {
          db.close();
          reject({name: 'AuthorizationRequired'});
        } else {
          db.run("DELETE FROM comment WHERE id = ?", row.id, (err) => {
            db.close();
            if(err) {
              reject(err);
            } else {
              resolve();
            }
          })
        }
      })
    });
  },
  /**
   * Get all comments of a post
   * @param {Object} post
   * @property {Number} id - The post's id
   * @property {Number} commentPage - The comment's page number
   * @property {Number} nResults - The number of comments that will be returned for that page
   * @returns {Promise<Object[]>} List of comments
   */
  getAllComments(post) {
    const db = getDBInstance();
    
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM comment WHERE post = ? LIMIT ? OFFSET ?", post.id, post.nResults, (post.commentPage-1)*post.nResults, (err, rows) => {
        db.close();
        if(err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },
  /**
   * Gets the number of comments of a post
   * @param {Object} post
   * @property {Number} id - The post's id
   * @returns {Promise<Number>} The number of comments of the post
   */
  getNumberOfCommentsByPost(post) {
    
    const db = getDBInstance();

    return new Promise((resolve, reject) => {
      db.get("SELECT COUNT(*) AS nComments FROM comment WHERE post = ?", post.id, (err, row) => {
        db.close();
        if(err) {
          reject(err);
        } else if(!row) {
          resolve(0);
        } else {
          resolve(row.nComments);
        }
      });
    });
  },
  /**
   * Gets the number of comments of a user
   * @param {Object} user
   * @property {String} username - The user's userrname
   * @returns {Promise<Number>} The number of comments of the user
   */
  getNumberOfCommentsByUser(user) {
    const db = getDBInstance();

    return new Promise((resolve, reject) => {
      db.get("SELECT COUNT(*) AS nComments FROM comment WHERE author = ?", user.username, (err, row) => {
        db.close();
        if(err) {
          reject(err);
        } else if(!row) {
          resolve(0);
        } else {
          resolve(row.nComments);
        }
      });
    });
  }
};