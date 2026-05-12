const pool = require("../db");
const bcrypt = require("bcrypt");

async function createUser(name, email, password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const result = await pool.query(
    `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, name, email, created_at
    `,
    [name, email, hashedPassword],
  );

  return result.rows[0];
}

async function loginUser(email, password) {
  const result = await pool.query(
    `
    SELECT *
    FROM users
    WHERE email = $1
    `,
    [email],
  );

  const user = result.rows[0];

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error("Senha inválida");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

module.exports = {
  createUser,
  loginUser,
};
