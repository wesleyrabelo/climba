const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/auth", userRoutes);

app.use("/tasks", taskRoutes);

app.listen(3000, () => {
  console.log("Servidor rodando");
});
