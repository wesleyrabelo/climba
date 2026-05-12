const {
  createTask,
  getTaskByUserId,
  getTaskByTitle,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../services/taskService");

async function create(req, res) {
  try {
    const task = await createTask(req.body);

    res.status(201).json(task);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erro ao criar tarefa",
    });
  }
}

async function findByUserId(req, res) {
  try {
    const { id } = req.params;
    const { search, status } = req.query;

    const tasks = await getTaskByUserId(id, search, status);

    res.json(tasks);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erro ao buscar tarefas",
    });
  }
}

async function findById(req, res) {
  try {
    const { id } = req.params;

    const task = await getTaskById(id);

    if (!task) {
      return res.status(404).json({
        message: "Tarefa não encontrada",
      });
    }

    res.json(task);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erro ao buscar tarefa",
    });
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;

    const updatedTask = await updateTask(id, req.body);

    if (!updatedTask) {
      return res.status(404).json({
        message: "Tarefa não encontrada",
      });
    }

    res.json(updatedTask);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erro ao atualizar tarefa",
    });
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;

    await deleteTask(id);

    res.json({
      message: "Tarefa removida com sucesso",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erro ao remover tarefa",
    });
  }
}

module.exports = {
  create,
  findByUserId,
  findById,
  update,
  remove,
};
