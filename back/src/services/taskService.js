const pool = require("../db");

async function createTask(task) {
  const { title, description, due_date, users_id, status } = task;

  const result = await pool.query(
    `
      INSERT INTO tasks (
        title,
        description,
        due_date,
        users_id,
        status
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `,
    [title, description, due_date, users_id, status],
  );

  return result.rows[0];
}

async function getTaskByUserId(id) {
  const result = await pool.query(`
    SELECT *
    FROM tasks
    WHERE users_id = ${id}
    ORDER BY created_at DESC
  `);

  return result.rows;
}

async function getTaskById(id) {
  const result = await pool.query(
    `
      SELECT *
      FROM tasks
      WHERE id = $1
    `,
    [id],
  );

  return result.rows[0];
}

async function updateTask(id, task) {
  const { title, description, due_date, status, completed_at } = task;

  const result = await pool.query(
    `
      UPDATE tasks
      SET
        title = $1,
        description = $2,
        due_date = $3,
        status = $4,
        completed_at = $5
      WHERE id = $6
      RETURNING *
    `,
    [title, description, due_date, status, completed_at, id],
  );

  return result.rows[0];
}

async function deleteTask(id) {
  await pool.query(
    `
      DELETE FROM tasks
      WHERE id = $1
    `,
    [id],
  );
}

module.exports = {
  createTask,
  getTaskByUserId,
  getTaskById,
  updateTask,
  deleteTask,
};
