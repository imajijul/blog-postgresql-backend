CREATE TABLE roles(
	id SERIAL PRIMARY KEY NOT NULL,
	name VARCHAR(50) NOT NULL UNIQUE,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW()
)

INSERT INTO roles(name) VALUES ('super_admin'), ('admin'), ('user')