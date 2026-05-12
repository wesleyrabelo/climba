const express = require("express");

const auth = require("../middleware/auth");

const router = express.Router();

const {
  create,
  findById,
  findByUserId,
  update,
  remove,
} = require("../controllers/taskController");

router.post("/", auth, create);

router.get("/user", auth, findByUserId);

router.put("/:id", auth, update);

router.delete("/:id", auth, remove);

module.exports = router;
