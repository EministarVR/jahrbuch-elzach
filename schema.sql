-- MySQL Schema for Jahrbuch

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user','moderator','admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  text TEXT NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'Allgemein',
  name VARCHAR(100),
  phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  -- Moderationsfelder
  status ENUM('pending','approved','deleted') NOT NULL DEFAULT 'pending',
  approved_by INT NULL,
  approved_at TIMESTAMP NULL,
  deleted_by INT NULL,
  deleted_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (approved_by) REFERENCES users(id),
  FOREIGN KEY (deleted_by) REFERENCES users(id)
);

-- Audit-Log für Moderationsereignisse
CREATE TABLE IF NOT EXISTS submission_audit (
  id INT AUTO_INCREMENT PRIMARY KEY,
  submission_id INT NOT NULL,
  action ENUM('create','approve','delete','restore') NOT NULL,
  actor_user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (submission_id) REFERENCES submissions(id),
  FOREIGN KEY (actor_user_id) REFERENCES users(id)
);


-- Banned users (by user id)
CREATE TABLE IF NOT EXISTS banned_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  reason VARCHAR(255) NULL,
  expires_at TIMESTAMP NULL,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Banned IPs
CREATE TABLE IF NOT EXISTS banned_ips (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ip VARCHAR(64) NOT NULL,
  reason VARCHAR(255) NULL,
  expires_at TIMESTAMP NULL,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_ip (ip),
  FOREIGN KEY (created_by) REFERENCES users(id)
);
