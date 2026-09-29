-- SmartShop AI - MySQL Database Schema
-- Run this file to initialize the database

CREATE DATABASE IF NOT EXISTS smartshop_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE smartshop_ai;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INT DEFAULT 0,
  brand VARCHAR(100),
  marketplace VARCHAR(100) DEFAULT 'Demo Store',
  sustainability_score INT DEFAULT 0,
  image_url VARCHAR(500),
  specifications JSON,
  discount_percent INT DEFAULT 0,
  in_stock BOOLEAN DEFAULT TRUE,
  tags VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  user_name VARCHAR(100),
  review_text TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_date DATE,
  verified_purchase BOOLEAN DEFAULT FALSE,
  helpful_count INT DEFAULT 0,
  analysis_status ENUM('pending','analyzed','flagged') DEFAULT 'pending',
  sentiment_score DECIMAL(4,3),
  is_suspicious BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Price history table
CREATE TABLE IF NOT EXISTS price_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  recorded_price DECIMAL(10,2) NOT NULL,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  source VARCHAR(100) DEFAULT 'demo',
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_wishlist (user_id, product_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Price alerts table
CREATE TABLE IF NOT EXISTS price_alerts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  target_price DECIMAL(10,2) NOT NULL,
  status ENUM('active','triggered','paused') DEFAULT 'active',
  notified_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Shopping preferences table
CREATE TABLE IF NOT EXISTS shopping_preferences (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  preferred_categories JSON,
  budget_min DECIMAL(10,2) DEFAULT 0,
  budget_max DECIMAL(10,2) DEFAULT 100000,
  preferred_brands JSON,
  sustainability_preference ENUM('low','medium','high') DEFAULT 'medium',
  urgency ENUM('low','medium','high') DEFAULT 'medium',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Comparisons saved table
CREATE TABLE IF NOT EXISTS saved_comparisons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_ids JSON NOT NULL,
  name VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Chat history table
CREATE TABLE IF NOT EXISTS chat_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  session_id VARCHAR(100) NOT NULL,
  role ENUM('user','assistant') NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_session (session_id)
);

-- Demo user insert
INSERT IGNORE INTO users (id, name, email, password_hash) VALUES
(1, 'Demo User', 'demo@smartshop.ai', '$2b$10$demohashedpassword123456');

-- Insert default preferences for demo user
INSERT IGNORE INTO shopping_preferences (user_id, preferred_categories, budget_min, budget_max, preferred_brands, sustainability_preference, urgency)
VALUES (1, '["Electronics","Laptops","Smartphones"]', 5000, 80000, '["Sony","Samsung","Apple","Boat"]', 'medium', 'medium');
