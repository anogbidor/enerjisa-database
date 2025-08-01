-- schema.sql

-- Distributors table
CREATE TABLE distributors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  license_no VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dealers table
CREATE TABLE dealers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  license_no VARCHAR(50) UNIQUE NOT NULL,
  distributor_id INTEGER REFERENCES distributors(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stations table
CREATE TABLE stations (
  id SERIAL PRIMARY KEY,
  dealer_id INTEGER REFERENCES dealers(id) ON DELETE SET NULL,
  distributor_id INTEGER REFERENCES distributors(id) ON DELETE SET NULL,
  license_no VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255),
  city VARCHAR(100),
  district VARCHAR(100),
  address TEXT,
  status VARCHAR(50),
  license_start DATE,
  license_end DATE,
  contract_start DATE,
  contract_end DATE,
  is_cancelled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);