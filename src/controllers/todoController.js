const { todoRepository } = require('../repositories');

/**
 * Create a new todo
 */
const createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    const todo = await todoRepository.create({ title, description });
    res.status(201).json(todo.toJSON());
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
};

/**
 * Get all todos
 */
const getAllTodos = async (req, res) => {
  try {
    const todos = await todoRepository.findAll();
    res.json(todos.map(todo => todo.toJSON()));
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
};

/**
 * Get a todo by ID
 */
const getTodoById = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await todoRepository.findById(parseInt(id));

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(todo.toJSON());
  } catch (error) {
    console.error('Error fetching todo:', error);
    res.status(500).json({ error: 'Failed to fetch todo' });
  }
};

/**
 * Update a todo
 */
const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const todo = await todoRepository.update(parseInt(id), {
      title,
      description,
      completed,
    });

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(todo.toJSON());
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
};

/**
 * Delete a todo
 */
const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await todoRepository.delete(parseInt(id));

    if (!deleted) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
};

module.exports = {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
};
