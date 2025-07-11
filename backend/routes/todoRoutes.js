const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/verifyToken');
const { getTodos, createTodos, updateToDo, toggleCompleted, deleteToDo } = require('../controllers/todo-controllers/todoController');
const { searchTodos } = require('../controllers/todo-controllers/searchTodoController');

//verify user token first before carrying on with CRUD functions
router.get("/get", verifyToken, getTodos);
router.post("/save", verifyToken, createTodos);
router.put("/update/:id", verifyToken, updateToDo);
router.put("/toggle/:id", verifyToken, toggleCompleted);
router.delete("/delete/:id", verifyToken, deleteToDo);

router.get("/search", verifyToken, searchTodos);

module.exports = router;
