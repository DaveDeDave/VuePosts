const Database = require('better-sqlite3');
const argon2 = require('argon2');
const authController = require('../controllers/authController');
const fs = require('fs');

class DB {
  
  /**
   * Create a database instance
   * @param {Boolean} test - database for testing if it is true, database for production if it is false
   */
  constructor(test=false) {
    this.dbName = !test ? './db/db.sqlite' : './db/test/db.sqlite';
  }

  /**
   * Initializes the database if it doesn't exist
   * @param {Boolean} test - database for testing if it is true, database for production if it is false
   */
  static async init(test=false) {
    const dbName = !test ? './db/db.sqlite' : './db/test/db.sqlite';

    fs.access(dbName, async (err) => {
      if(err) {
        const db = new Database(dbName);
        db.pragma('foreign_keys = ON');
        
        try {
          await db.exec(fs.readFileSync('./db/schema.sql', 'utf8'));
          await db.exec(fs.readFileSync('./db/inputs.sql', 'utf8'));
        } catch(e) {
          throw e;
        } finally {
          db.close();
        }
      }
    });
  }

  /**
   * Gets a sqlite3 db instance with integrity constraints
   * @returns {sqlite3.Database} sqlite3 db instance
   */
  #getDBInstance() {
    const db = new Database(this.dbName);
    db.pragma('foreign_keys = ON');
    return db;
  }

  /**
   * Registers a new user
   * @param {Object} user
   * @property {String} username - The user's username
   * @property {String} password - The user's password
   * @returns {Promise<String>} JWT token
   */
  async createUser(user) {
    const db = this.#getDBInstance();

    try {
      const hash = await argon2.hash(user.password);

      const date = new Date();
      const registrationDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

      await db.prepare("INSERT INTO user VALUES (?, ?, '', '', '', ?, '', '', false)").run(user.username, hash, registrationDate);
    } catch(e) {
      if(e.message == 'UNIQUE constraint failed: user.username') {
        throw {name: 'UserAlreadyExists'};
      } else {
        throw e;
      }
    } finally {
      db.close();
    }

    return await authController.generateJWT({username: user.username});
  }

  /**
   * Tries to authenticate the user
   * @param {Object} user
   * @property {String} username - The user's username
   * @property {String} password - The user's password
   * @returns {Promise<String>} JWT token
   */
  async authenticateUser(user) {
    const db = this.#getDBInstance();

    try {
      let row = await db.prepare("SELECT password FROM user WHERE username = ?").get(user.username);
      if(!row) {
        throw {name: 'WrongCredentials'};
      } else if(await argon2.verify(row.password, user.password)) {
        return await authController.generateJWT({username: user.username});
      } else {
        throw {name: 'WrongCredentials'};
      }
    } catch(e) {
      throw e;
    } finally {
      db.close();
    }
  }

  /**
   * Deletes a user
   * @param {Object} user
   * @property {String} username - The user's username
   */
  async deleteUser(user) {
    const db = this.#getDBInstance();

    try {
      await db.prepare("DELETE FROM user WHERE username = ?").run(user.username);
    } catch(e) {
      throw e;
    } finally {
      db.close();
    }
  }

  /**
   * Gets user's personal informations
   * @param {Object} user
   * @property {String} username - The user's username
   * @property {Boolean} owner - Check if the user who require the informarions is the owner of the account 
   * @returns {Promise<Object>} User's informations
   */
  async getUserInfo(user) {
    const db = this.#getDBInstance();

    try {
      let row = await db.prepare("SELECT * FROM user WHERE username = ?").get(user.username);
      if(!row) {
        throw {name: 'NotFound'};
      } else if(!row.privateAccount || user.owner) {
        return {
          username: row.username,
          name: row.name,
          surname: row.surname,
          email: row.email,
          registrationDate: row.registrationDate,
          job: row.job,
          address: row.address,
          privateAccount: row.privateAccount
        };
      } else {
        return {
          privateAccount: row.privateAccount
        };
      }
    } catch(e) {
      throw e;
    } finally {
      db.close();
    }
  }

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
  async updateUserInfo(user) {
    const db = this.#getDBInstance();

    try {
      await db.prepare("UPDATE user SET name = ?, surname = ?, email = ?, job = ?, address = ?, privateAccount = ? WHERE username = ?").run(user.name, user.surname, user.email, user.job, user.address, user.privateAccount, user.username);
    } catch(e) {
      throw e;
    } finally {
      db.close();
    }
  }

  /**
   * Updates user's password
   * @param {Object} user
   * @property {String} username - The user's username
   * @property {String} oldPassword - The user's old password
   * @property {String} newPassword - The user's new password
   */
  async updateUserPassword(user) {
    const db = this.#getDBInstance();

    try {
      const row = await db.prepare("SELECT password FROM user WHERE username = ?").get(user.username);
      if(!row) {
        throw {name: 'WrongCredentials'};
      } else if(await argon2.verify(row.password, user.oldPassword)) {
        const hash = await argon2.hash(user.newPassword);
        await db.prepare("UPDATE user SET password = ? WHERE username = ?").run(hash, user.username);
      } else {
        throw {name: 'WrongCredentials'};
      }
    } catch(e) {
      throw e;
    } finally {
      db.close();
    }
  }

  /**
   * Creates a new post
   * @param {Object} post
   * @property {String} title - The post's title
   * @property {String} content - The post's content
   * @property {String} author - The author's username
   */
  async createPost(post) {
    const db = this.#getDBInstance();

    try {
      await db.prepare("INSERT INTO post (title, content, author) VALUES (?, ?, ?)").run(post.title, post.content, post.author);
    } catch(e) {
      throw e;
    } finally {
      db.close();
    }
  }

  /**
   * Deletes a post by id
   * @param {Object} post
   * @property {Number} id - The post's id
   * @property {String} username - The user who requested to delete the post
   */
  async deletePost(post) {
    const db = this.#getDBInstance();

    try {
      const row = await db.prepare("SELECT * FROM post WHERE id = ?").get(post.id);
      if(!row) {
        throw {name: 'NotFound'};
      } else if(row.author != post.username) {
        throw {name: 'AuthorizationRequired'};
      } else {
        await db.prepare("DELETE FROM post WHERE id = ?").run(post.id);
      }
    } catch(e) {
      throw e;
    } finally {
      db.close();
    }
  }

  /**
   * Gets all posts of a page
   * @param {Object} page - The page
   * @property {String} search - The search filter by title 
   * @property {Number} number - The page number
   * @property {Number} nResults - The number of posts that will be returned for that page
   * @returns {Promise<Object[]>} List of posts
   */
  async getAllPosts(page) {
    const db = this.#getDBInstance();

    try {
      return await db.prepare("SELECT * FROM post WHERE title LIKE ? LIMIT ? OFFSET ?").all(page.search, page.nResults, (page.number-1)*page.nResults);
    } catch(e) {
      throw e;
    } finally {
      db.close();
    }
  }

  /**
   * Gets a post by id
   * @param {Object} post
   * @property {Number} id - The post's id
   * @returns {Promise<Object>} The post
   */
  async getPost(post) {
    const db = this.#getDBInstance();

    try {
      const row = await db.prepare("SELECT * FROM post WHERE id = ?").get(post.id);
      if(!row) {
        throw {name: 'NotFound'};
      } else {
        return row;
      }
    } catch(e) {
      throw e;
    } finally {
      db.close();
    }
  }

  /**
   * Gets the total number of posts
   * @param {String} search - The search filter by title
   * @returns {Promise<Number>} The number of posts
   */
  async getNumberOfPosts(search) {
    const db = this.#getDBInstance();

    try {
      const row = await db.prepare("SELECT COUNT(*) AS nPosts FROM post WHERE title LIKE ?").get(search);
      return row ? row.nPosts : 0;
    } catch(e) {
      throw e;
    } finally {
      db.close();
    }
  }

  /**
   * Gets the number of posts of a user
   * @param {Object} user
   * @property {String} username
   * @returns {Promise<Number>} The number of posts of the user
   */
  async getNumberOfPostsByUser(user) {
    const db = this.#getDBInstance();

    try {
      const row = await db.prepare("SELECT COUNT(*) AS nPosts FROM post WHERE author = ?").get(user.username);
      return row ? row.nPosts : 0;
    } catch(e) {
      throw e;
    } finally {
      db.close();
    }
  }

  /**
   * Comments a post
   * @param {Object} comment
   * @property {Number} postID - The post's id
   * @property {String} text - The comment
   * @property {String} author - The comment's author
   */
  async createComment(comment) {
    const db = this.#getDBInstance();

    try {
      const row = await db.prepare("SELECT * FROM post WHERE id = ?").get(comment.postID);
      if(!row) {
        throw {name: 'NotFound'};
      } else {
        await db.prepare("INSERT INTO comment (content, post, author) VALUES (?, ?, ?)").run(comment.text, comment.postID, comment.author);
      }
    } catch(e) {
      throw e;
    } finally {
      db.close();
    }
  }

  /**
   * Deletes a comment by id
   * @param {Object} comment
   * @property {Number} id - The comment's id
   * @property {String} username - The user who requested to delete the comment
   */
  async deleteComment(comment) {
    const db = this.#getDBInstance();

    try {
      const row = await db.prepare("SELECT * FROM comment WHERE id = ?").get(comment.id);
      if(!row) {
        throw {name: 'NotFound'};
      } else if(row.author != comment.username) {
        throw {name: 'AuthorizationRequired'};
      } else {
        await db.prepare("DELETE FROM comment WHERE id = ?").run(row.id);
      }
    } catch(e) {
      throw e;
    } finally {
      db.close();
    }
  }

  /**
   * Get all comments of a post
   * @param {Object} post
   * @property {Number} id - The post's id
   * @property {Number} commentPage - The comment's page number
   * @property {Number} nResults - The number of comments that will be returned for that page
   * @returns {Promise<Object[]>} List of comments
   */
  async getAllComments(post) {
    const db = this.#getDBInstance();

    try {
      return await db.prepare("SELECT * FROM comment WHERE post = ? LIMIT ? OFFSET ?").all(post.id, post.nResults, (post.commentPage-1)*post.nResults);
    } catch(e) {
      throw e;
    } finally {
      db.close();
    }
  }

  /**
   * Gets the number of comments of a post
   * @param {Object} post
   * @property {Number} id - The post's id
   * @returns {Promise<Number>} The number of comments of the post
   */
  async getNumberOfCommentsByPost(post) {
    const db = this.#getDBInstance();

    try {
      const row = await db.prepare("SELECT COUNT(*) AS nComments FROM comment WHERE post = ?").get(post.id);
      return row ? row.nComments : 0;
    } catch(e) {
      throw e;
    } finally {
      db.close();
    }
  }

  /**
   * Gets the number of comments of a user
   * @param {Object} user
   * @property {String} username - The user's userrname
   * @returns {Promise<Number>} The number of comments of the user
   */
  async getNumberOfCommentsByUser(user) {
    const db = this.#getDBInstance();

    try {
      const row = await db.prepare("SELECT COUNT(*) AS nComments FROM comment WHERE author = ?").get(user.username);
      return row ? row.nComments : 0;
    } catch(e) {
      throw e;
    } finally {
      db.close();
    }
  }

}

module.exports = DB;
