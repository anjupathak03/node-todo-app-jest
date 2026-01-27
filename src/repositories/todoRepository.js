const db = require('../database');
const { Todo } = require('../models');

class TodoRepository {
  /**
   * Create a new todo
   * @param {Object} todoData - { title, description }
   * @returns {Promise<Todo>}
   */
  async create(todoData) {
    const { title, description = '' } = todoData;
    
    const sql = 'INSERT INTO todos (title, description) VALUES (?, ?)';
    const result = await db.query(sql, [title, description]);
    
    return this.findById(result.insertId);
  }

  /**
   * Get all todos
   * @returns {Promise<Todo[]>}
   */
  async findAll() {
    const sql = 'SELECT * FROM todos ORDER BY created_at DESC';
    const rows = await db.query(sql);
    
    return Todo.fromRows(rows);
  }

  /**
   * Find a todo by ID
   * @param {number} id
   * @returns {Promise<Todo|null>}
   */
  async findById(id) {
    const sql = 'SELECT * FROM todos WHERE id = ?';
    const rows = await db.query(sql, [id]);
    
    if (rows.length === 0) {
      return null;
    }
    
    return Todo.fromRow(rows[0]);
  }

  /**
   * Update a todo
   * @param {number} id
   * @param {Object} updateData - { title?, description?, completed? }
   * @returns {Promise<Todo|null>}
   */
  async update(id, updateData) {
    const existingTodo = await this.findById(id);
    if (!existingTodo) {
      return null;
    }

    const fields = [];
    const values = [];

    if (updateData.title !== undefined) {
      fields.push('title = ?');
      values.push(updateData.title);
    }
    if (updateData.description !== undefined) {
      fields.push('description = ?');
      values.push(updateData.description);
    }
    if (updateData.completed !== undefined) {
      fields.push('completed = ?');
      values.push(updateData.completed);
    }

    if (fields.length === 0) {
      return existingTodo;
    }

    values.push(id);
    const sql = `UPDATE todos SET ${fields.join(', ')} WHERE id = ?`;
    await db.query(sql, values);

    return this.findById(id);
  }

  /**
   * Delete a todo
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    const sql = 'DELETE FROM todos WHERE id = ?';
    const result = await db.query(sql, [id]);
    
    return result.affectedRows > 0;
  }

  /**
   * Delete all todos (for testing)
   * @returns {Promise<void>}
   */
  async deleteAll() {
    const sql = 'DELETE FROM todos';
    await db.query(sql);
  }
}

module.exports = new TodoRepository();
