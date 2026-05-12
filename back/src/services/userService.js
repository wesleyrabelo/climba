const pool = require("../db");

async function createUser(name, email, password) {
  const result = await pool.query(
    `
      INSERT INTO users (
        name,
        email,
        password
      )
      VALUES ($1, $2, $3)
      RETURNING id, name, email, created_at
    `,
    [name, email, password],
  );

  return result.rows[0];
}

async function loginUser(email, password) {
  const result = await pool.query(
    `
      SELECT *
      FROM users
      WHERE email = $1
      AND password = $2
    `,
    [email, password],
  );

  return result.rows[0];
}

module.exports = {
  createUser,
  loginUser,
};
