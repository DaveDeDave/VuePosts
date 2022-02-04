-- Password: VuePosts12.
INSERT INTO user VALUES ('gianni', '$argon2i$v=19$m=4096,t=3,p=1$DB7STJ2ZhOo6Q+b4oKcZgg$l50XjT7LXO5fzKvh7DGm6MKwvWrPgREnapPvOyg0kqU', 'Gianni', 'Bicicletta', 'gianni.bicicletta@bike.com', '2020-5-11', 'Senior Developer', 'Rio De Janeiro', 0);
INSERT INTO user VALUES ('carlo', '$argon2i$v=19$m=4096,t=3,p=1$DB7STJ2ZhOo6Q+b4oKcZgg$l50XjT7LXO5fzKvh7DGm6MKwvWrPgREnapPvOyg0kqU', 'Carlo', '', '', '2021-9-21', '', 'Rio De Janeiro', 1);
INSERT INTO user VALUES ('mark', '$argon2i$v=19$m=4096,t=3,p=1$DB7STJ2ZhOo6Q+b4oKcZgg$l50XjT7LXO5fzKvh7DGm6MKwvWrPgREnapPvOyg0kqU', 'Mark', 'White', '', '2021-9-24', 'The Master', 'Who know', 0);

INSERT INTO post VALUES (1, 'Primo Articolo', '<h3>Ciao a tutti!</h3><p>Questo è il <strong>primo</strong> articolo. <em>Ciao a tutti!</em></p>', 'gianni');
INSERT INTO post VALUES (2, 'Secondo articolo', '<p><s>Ecco il secondo articolo.</s> Il secondo articolo è finalmente arrivato.</p><pre><code>int a = 1;
int b = 2;
return a + b;</code></pre>', 'gianni');
INSERT INTO post VALUES (3, 'Cats', '<h2><s>CCaaats</s>Cats</h2><p>Today we are talking about <code>cats</code></p>', 'carlo');
INSERT INTO post VALUES (4, 'Terzo articolo', '<p><strong>è appena arrivato il terzo articolo</strong></p><p><mark>Correte a leggerlo!</mark></p>', 'gianni');
INSERT INTO post VALUES (5, 'Code with mark', '<p>hi guys!</p><p>today we are coding with me</p><pre><code>console.log("Why am i printing this?");</code></pre>', 'mark');
INSERT INTO post VALUES (6, 'Test', '<p><strong>test</strong><em>test</em><s>test</s><mark>test</mark>test</p><hr><blockquote><p>Just for testing</p></blockquote>', 'mark');
INSERT INTO post VALUES (7, 'Python first lesson', '<p>Today we are learning python:</p><pre><code>print("it is so easy") # print the statement "it is so easy"
a = 2
b = 3
a, b = b, a # it swaps the value of a and b
# i will print:
# 0
# 1
# 2
for x in range(3):
  print(x)</code></pre>', 'mark');


INSERT INTO comment (content, post, author) VALUES ('<p>ok va bene, vediamo se <strong><em>va</em></strong></p>', 1, 'carlo');
INSERT INTO comment (content, post, author) VALUES ('<p>Potevi fare anche:</p><pre><code>return 3;</code></pre>', 2, 'carlo');
INSERT INTO comment (content, post, author) VALUES ('<p>Si va, inoltre puoi:</p><ul><li><p>Creare i tuoi post</p></li><li><p>Formattare il testo come meglio credi</p></li></ul>', 1, 'gianni');

INSERT INTO comment (content, post, author) VALUES ('<p>This will be the post with the most comments</p>', 3, 'gianni');
INSERT INTO comment (content, post, author) VALUES ('<h3>yeah, <strong><mark>it </mark><s><mark>wont</mark></s><mark> will be definetely </mark></strong></h3>', 3, 'carlo');
INSERT INTO comment (content, post, author) VALUES ('<pre><code>for cat in cats:
  print(cat)</code></pre>', 3, 'mark');
INSERT INTO comment (content, post, author) VALUES ('<p><em>Random comment hits the post</em></p>', 3, 'gianni');
INSERT INTO comment (content, post, author) VALUES ('<p>Topics of this post:</p><ul><li><p>cats</p></li><li><p>coding</p></li><li><p>cats coding</p></li></ul>', 3, 'gianni');
INSERT INTO comment (content, post, author) VALUES ('<pre><code>import cats
cats.joinTheParty()</code></pre>', 3, 'mark');
INSERT INTO comment (content, post, author) VALUES ('<p>Ok, i think this is <strong>enough</strong></p>', 3, 'carlo');