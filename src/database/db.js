const mysql = require('mysql2/promise');
const config = require('../config');

let pool = null;

/**
 * Initialize the database connection pool
 */
const initPool = () => {
  if (!pool) {
    pool = mysql.createPool({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
};

/**
 * Get the database pool
 */
const getPool = () => {
  if (!pool) {
    return initPool();
  }
  return pool;
};

/**
 * Execute a query
 */
const query = async (sql, params = []) => {
  const connection = getPool();
  const [results] = await connection.execute(sql, params);
  return results;
};

/**
 * Create the todos table if it doesn't exist
 */
const createTodosTable = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS todos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      completed BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;
  await query(sql);
  console.log('Todos table created or already exists');
};

/**
 * Close the pool
 */
const closePool = async () => {
  if (pool) {
    await pool.end();
    pool = null;
  }
};

module.exports = {
  initPool,
  getPool,
  query,
  createTodosTable,
  closePool,
};
