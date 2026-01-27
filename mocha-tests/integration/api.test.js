const chai = require('chai');
const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/database');

const { expect } = chai;

// Helper function to add delay (helps with Keploy proxy stability)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('Todo API Integration Tests (Mocha)', function() {
  this.timeout(10000);

  before(async function() {
    // Initialize database
    db.initPool();
    await db.createTodosTable();
  });

  after(async function() {
    // Close database connection
    await db.closePool();
  });

  beforeEach(async function() {
    // Clean up todos before each test
    await db.query('DELETE FROM todos');
    // Small delay to prevent socket hang up issues with Keploy
    await delay(50);
  });

  describe('POST /api/todos', function() {
    it('should create a new todo', async function() {
      const res = await request(app)
        .post('/api/todos')
        .send({
          title: 'Mocha Test Todo',
          description: 'Created during Mocha integration test',
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('title', 'Mocha Test Todo');
      expect(res.body).to.have.property('description', 'Created during Mocha integration test');
      expect(res.body).to.have.property('completed', false);
      expect(res.body).to.have.property('id');
    });

    it('should create a todo without description', async function() {
      const res = await request(app)
        .post('/api/todos')
        .send({ title: 'Todo without description' });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('title', 'Todo without description');
      expect(res.body).to.have.property('description', '');
    });

    it('should return 400 for missing title', async function() {
      const res = await request(app)
        .post('/api/todos')
        .send({ description: 'No title' });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('error', 'Title is required');
    });

    it('should return 400 for empty title', async function() {
      const res = await request(app)
        .post('/api/todos')
        .send({ title: '' });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('error', 'Title is required');
    });
  });

  describe('GET /api/todos', function() {
    it('should return empty array when no todos', async function() {
      const res = await request(app)
        .get('/api/todos');

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').that.is.empty;
    });
  });

  describe('GET /api/todos/:id', function() {
    it('should return a todo by ID', async function() {
      // Create a todo first
      const createRes = await request(app)
        .post('/api/todos')
        .send({ title: 'Get Me', description: 'Find me by ID' });

      const res = await request(app)
        .get(`/api/todos/${createRes.body.id}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('title', 'Get Me');
      expect(res.body).to.have.property('description', 'Find me by ID');
    });

    it('should return 404 for non-existent todo', async function() {
      const res = await request(app)
        .get('/api/todos/99999');

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('error', 'Todo not found');
    });
  });

  describe('PUT /api/todos/:id', function() {
    it('should return 404 for non-existent todo', async function() {
      const res = await request(app)
        .put('/api/todos/99999')
        .send({ title: 'Updated' });

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('error', 'Todo not found');
    });
  });

  describe('DELETE /api/todos/:id', function() {
    it('should return 404 for non-existent todo', async function() {
      const res = await request(app)
        .delete('/api/todos/99999');

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('error', 'Todo not found');
    });
  });

  describe('GET /api/health', function() {
    it('should return health status', async function() {
      const res = await request(app)
        .get('/api/health');

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('status', 'ok');
      expect(res.body).to.have.property('timestamp');
    });
  });

  describe('404 Handler', function() {
    it('should return 404 for unknown routes', async function() {
      const res = await request(app)
        .get('/unknown/route');

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('error', 'Not found');
    });
  });
});
