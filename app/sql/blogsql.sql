CREATE TABLE blogs (
	id SERIAL NOT NULL,
	title VARCHAR(200),
	description VARCHAR(250),
	author INT,
	created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO blogs (title, description, author) 
VALUES ('About myself', 'Lorem ipsum dolor sit amet" is the opening phrase of a commonly used placeholder text known as Lorem Ipsum. Designers, publishers, and developers use it to fill layouts with realistic-looking text before the final content is available.', 3)


CREATE TABLE users (
	id SERIAL PRIMARY KEY NOT NULL,
	name VARCHAR(200),
	email VARCHAR(250) UNIQUE NOT NULL,
	phone VARCHAR(11) UNIQUE NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

ALTER TABLE users
ADD password VARCHAR(50);

SELECT * FROM users;