const express = require("express");

const router = express.Router();

const {
  create,
  findById,
  findByUserId,
  update,
  remove,
} = require("../controllers/taskController");

router.post("/", create);

router.get("/user/:id", findByUserId);

router.get("/:id", findById);

router.put("/:id", update);

router.delete("/:id", remove);

module.exports = router;
