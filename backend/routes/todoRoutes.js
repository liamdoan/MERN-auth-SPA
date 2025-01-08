const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/verifyToken');
const { getTodos, createTodos, updateToDo, toggleCompleted, deleteToDo } = require('../controllers/todo-controllers/todoController');

router.get("/get", verifyToken, getTodos);
router.post("/save", verifyToken, createTodos);
router.put("/update/:id", verifyToken, updateToDo);
router.put("/toggle/:id", verifyToken, toggleCompleted);
router.delete("/delete/:id", verifyToken, deleteToDo);

module.exports = router;
