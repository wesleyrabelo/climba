const { createUser, loginUser } = require("../services/userService");

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    const user = await createUser(name, email, password);

    res.status(201).json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erro ao criar usuário",
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const data = await loginUser(email, password);

    if (!data) {
      return res.status(401).json({
        message: "Email ou senha inválidos",
      });
    }

    res.json({
      data,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erro ao realizar login",
    });
  }
}

module.exports = {
  register,
  login,
};
