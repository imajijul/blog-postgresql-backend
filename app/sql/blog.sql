CREATE TABLE user_devices(
	id INT SERIAL PRIMARY KEY,
	user_id INT REFERENCES users(id)
)

SELECT * FROM users;

ALTER TABLE users
ADD refresh_token TEXT

ALTER TABLE users
ADD role TEXT NOT NULL
DEFAULT 'user'
CHECK (role IN ('admin', 'user'));


UPDATE users
SET role = 'user'
WHERE id = 5 ;

ALTER TABLE blogs
ADD PRIMARY KEY (id);

CREATE TABLE comments(
	id SERIAL PRIMARY KEY,
	blog_id INT REFERENCES blogs(id),
	uer_id INT REFERENCES users(id),
	comment_text TEXT,
	createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
	updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
);

-- rename column name
ALTER TABLE coments
RENAME uer_id TO user_id;


SELECT * FROM coments;
SELECT * FROM blogs;