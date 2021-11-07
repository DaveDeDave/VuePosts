CREATE TABLE user (
  username TEXT PRIMARY KEY,
  password TEXT NOT NULL,
  name TEXT,
  surname TEXT,
  email TEXT,
  registrationDate DATE,
  job TEXT,
  address TEXT,
  privateAccount BOOLEAN
);

CREATE TABLE post (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  FOREIGN KEY (author) REFERENCES user(username) ON DELETE CASCADE
);

CREATE TABLE comment (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL,
  post INTEGER NOT NULL,
  author TEXT NOT NULL,
  FOREIGN KEY (author) REFERENCES user(username) ON DELETE CASCADE,
  FOREIGN KEY (post) REFERENCES post(id) ON DELETE CASCADE
);