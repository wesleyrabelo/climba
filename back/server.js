const express = require("express");
const pool = require("./db");

const app = express();

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro no banco");
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
