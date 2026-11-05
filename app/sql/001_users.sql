CREATE TABLE users(
	id SERIAL PRIMARY KEY,
	name VARCHAR(200),
	email VARCHAR(250),
	phone VARCHAR(11),
	password VARCHAR(50),
	created_at TIMESTAMP NOT NULL DEFAULT NOW()
)

ALTER TABLE users
ADD COLUMN role_id INTEGER NOT NULL REFERENCES roles(id) DEFAULT 3

ALTER TABLE users
ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT NOW()

ALTER TABLE users
ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT NOW()


ALTER TABLE users
ADD COLUMN is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN verification_token TEXT,
ADD COLUMN IF NOT EXISTS verification_expires TIMESTAMP,
ADD COLUMN IF NOT EXISTS reset_password_token TEXT,
ADD COLUMN IF NOT EXISTS reset_password_expires TIMESTAMP;

ALTER TABLE users 
ADD COLUMN status TEXT NOT NULL DEFAULT 'inactive' CHECK(status in ('active', 'inactive', 'block'))

ALTER TABLE users
ALTER COLUMN password TYPE VARCHAR(255)


SELECT * FROM users

delete from users where id =3
