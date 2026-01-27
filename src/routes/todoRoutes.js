const express = require('express');
const { todoController } = require('../controllers');

const router = express.Router();

// Todo routes
router.post('/todos', todoController.createTodo);
router.get('/todos', todoController.getAllTodos);
router.get('/todos/:id', todoController.getTodoById);
router.put('/todos/:id', todoController.updateTodo);
router.delete('/todos/:id', todoController.deleteTodo);

module.exports = router;
