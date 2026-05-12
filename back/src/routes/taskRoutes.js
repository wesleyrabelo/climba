const express = require("express");

const router = express.Router();

const {
  create,
  findAll,
  findById,
  update,
  remove,
} = require("../controllers/taskController");

router.post("/", create);

router.get("/", findAll);

router.get("/:id", findById);

router.put("/:id", update);

router.delete("/:id", remove);

module.exports = router;
