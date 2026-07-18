CREATE TABLE user_devices(
	id SERIAL PRIMARY KEY,
	user_id INT REFERENCES users(id),
	browser VARCHAR(100),
	os VARCHAR(100),
	device_name VARCHAR(100),
	user_agent TEXT,
	ip_address VARCHAR(50),
	is_active BOOLEAN DEFAULT TRUE
	refresh_token TEXT NOT NULL,
	last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);


