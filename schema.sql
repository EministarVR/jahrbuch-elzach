-- MySQL Schema for Jahrbuch

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user','moderator','admin') DEFAULT 'user',
  class VARCHAR(50) NULL,
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

-- Phase Settings (Phasensteuerung)
CREATE TABLE IF NOT EXISTS phase_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phase_key VARCHAR(50) NOT NULL UNIQUE,
  enabled BOOLEAN NOT NULL DEFAULT FALSE,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  status VARCHAR(50) DEFAULT 'active',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by INT NULL,
  FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- Default phase settings
INSERT INTO phase_settings (phase_key, enabled, title, description, status) VALUES
  ('phase-1', TRUE, 'Phase 1: Einsendungen', 'Reiche deine Inhalte für das Jahrbuch ein', 'active'),
  ('phase-2', FALSE, 'Phase 2: Abstimmungen', 'Stimme über verschiedene Jahrbuch-Themen ab', 'active'),
  ('phase-3', FALSE, 'Phase 3: Finalisierung', 'Letzte Anpassungen und Vorschau', 'development');

-- Poll Responses (Umfrage-Antworten)
CREATE TABLE IF NOT EXISTS poll_responses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  poll_id VARCHAR(100) NOT NULL,
  question_id VARCHAR(100) NOT NULL,
  answer_value TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_question (user_id, question_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_poll (poll_id),
  INDEX idx_question (question_id)
);
