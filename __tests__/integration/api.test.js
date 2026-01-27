const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/database');

describe('Todo API Integration Tests', () => {
  let createdTodoId;

  beforeAll(async () => {
    // Initialize database
    db.initPool();
    await db.createTodosTable();
  });

  afterAll(async () => {
    // Close database connection
    await db.closePool();
  });

  beforeEach(async () => {
    // Clean up todos before each test
    await db.query('DELETE FROM todos');
  });

  describe('POST /api/todos', () => {
    it('should create a new todo', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({
          title: 'Integration Test Todo',
          description: 'Created during integration test',
        })
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toMatchObject({
        title: 'Integration Test Todo',
        description: 'Created during integration test',
        completed: false,
      });
      expect(response.body.id).toBeDefined();

      createdTodoId = response.body.id;
    });

    it('should create a todo without description', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ title: 'Todo without description' })
        .expect(201);

      expect(response.body.title).toBe('Todo without description');
      expect(response.body.description).toBe('');
    });

    it('should return 400 for missing title', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ description: 'No title' })
        .expect(400);

      expect(response.body.error).toBe('Title is required');
    });

    it('should return 400 for empty title', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ title: '' })
        .expect(400);

      expect(response.body.error).toBe('Title is required');
    });
  });

  describe('GET /api/todos', () => {
    it('should return empty array when no todos', async () => {
      const response = await request(app)
        .get('/api/todos')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('GET /api/todos/:id', () => {
    it('should return a todo by ID', async () => {
      // Create a todo first
      const createResponse = await request(app)
        .post('/api/todos')
        .send({ title: 'Get Me', description: 'Find me by ID' });

      const response = await request(app)
        .get(`/api/todos/${createResponse.body.id}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.title).toBe('Get Me');
      expect(response.body.description).toBe('Find me by ID');
    });

    it('should return 404 for non-existent todo', async () => {
      const response = await request(app)
        .get('/api/todos/99999')
        .expect(404);

      expect(response.body.error).toBe('Todo not found');
    });
  });

  describe('PUT /api/todos/:id', () => {
    it('should return 404 for non-existent todo', async () => {
      const response = await request(app)
        .put('/api/todos/99999')
        .send({ title: 'Updated' })
        .expect(404);

      expect(response.body.error).toBe('Todo not found');
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('should return 404 for non-existent todo', async () => {
      const response = await request(app)
        .delete('/api/todos/99999')
        .expect(404);

      expect(response.body.error).toBe('Todo not found');
    });
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.status).toBe('ok');
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/unknown/route')
        .expect(404);

      expect(response.body.error).toBe('Not found');
    });
  });
});
