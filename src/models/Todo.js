/**
 * Todo Model
 * Represents a Todo item in the application
 */

class Todo {
  constructor({ id, title, description, completed, created_at, updated_at }) {
    this.id = id;
    this.title = title;
    this.description = description || '';
    this.completed = completed || false;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
  }

  /**
   * Convert to JSON representation
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      completed: Boolean(this.completed),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Create Todo from database row
   */
  static fromRow(row) {
    return new Todo(row);
  }

  /**
   * Create array of Todos from database rows
   */
  static fromRows(rows) {
    return rows.map(row => Todo.fromRow(row));
  }
}

module.exports = Todo;
