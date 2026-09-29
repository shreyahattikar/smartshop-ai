const mysql2 = require('mysql2/promise');

let pool;

function getPool() {
  if (!pool) {
    pool = mysql2.createPool({
      host:     process.env.DB_HOST     || 'localhost',
      port:     parseInt(process.env.DB_PORT) || 3306,
      user:     process.env.DB_USER     || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME     || 'smartshop_ai',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      namedPlaceholders: true
    });
  }
  return pool;
}

async function query(sql, params = []) {
  try {
    const [rows] = await getPool().execute(sql, params);
    return rows;
  } catch (err) {
    console.error('[DB Error]', err.message);
    throw err;
  }
}

module.exports = { getPool, query };
