# Node.js Todo App with MySQL and Keploy

A REST API Todo application built with Node.js, Express, and MySQL, featuring comprehensive Jest tests and Keploy integration for mocking database calls.

## Project Structure

```
node-todo-app/
├── src/
│   ├── config/         # Configuration settings
│   ├── controllers/    # Request handlers
│   ├── database/       # Database connection
│   ├── models/         # Data models
│   ├── repositories/   # Data access layer
│   ├── routes/         # API routes
│   ├── app.js          # Express app
│   └── index.js        # Entry point
├── __tests__/
│   └── integration/    # Jest integration tests
├── mocha-tests/
│   └── integration/    # Mocha integration tests
├── docker-compose.yml  # Docker Compose configuration
├── package.json
└── .env
```

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start MySQL Database with Docker Compose
```bash
docker-compose up -d
```

This will start a MySQL 8.0 container with:
- **Database**: `todo_db`
- **Root password**: `password`
- **Port**: `3306`

### 3. Configure Environment
```bash
cp .env.example .env
```

Default `.env` configuration (works with Docker Compose):
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=todo_db
```

### 4. Run the Application
```bash
npm start
# or
npm run dev  # with auto-reload
```

### 5. Stop the Database
```bash
docker-compose down
```

## API Endpoints

| Method | Endpoint      | Description        |
|--------|---------------|--------------------|
| GET    | /api/health   | Health check       |
| POST   | /api/todos    | Create a todo      |
| GET    | /api/todos    | Get all todos      |
| GET    | /api/todos/:id| Get todo by ID     |
| PUT    | /api/todos/:id| Update a todo      |
| DELETE | /api/todos/:id| Delete a todo      |

## Testing

This project includes two test frameworks: **Jest** and **Mocha**. Both require the database to be running.

### Run Jest Tests
```bash
npm test
```

### Run Mocha Tests
```bash
npm run test:mocha
```

## Using Keploy for Mocking

Keploy records database calls and replays them during tests, eliminating the need for a real database.

### Recording Mocks

```bash
# Record database calls during Jest integration tests
C:\Users\nehap\keploy\keploy.exe mock record -c "npm test -- --testPathPattern=integration"

# Record database calls during Mocha tests
C:\Users\nehap\keploy\keploy.exe mock record -c "npm run test:mocha"
```

### Replaying with Mocks

```bash
# Run Jest tests with recorded mocks (no database needed!)
C:\Users\nehap\keploy\keploy.exe mock test -c "npm test -- --testPathPattern=integration"

# Run Mocha tests with recorded mocks (no database needed!)
C:\Users\nehap\keploy\keploy.exe mock test -c "npm run test:mocha"
```

## API Examples

### Create a Todo
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn Node.js","description":"Study Express and MySQL"}'
```

### Get All Todos
```bash
curl http://localhost:3000/api/todos
```

### Get Todo by ID
```bash
curl http://localhost:3000/api/todos/1
```

### Update Todo
```bash
curl -X PUT http://localhost:3000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'
```

### Delete Todo
```bash
curl -X DELETE http://localhost:3000/api/todos/1
```

## Dependencies

### Production
- **express** - Web framework
- **mysql2** - MySQL client with Promise support
- **dotenv** - Environment variable management

### Development
- **jest** - Testing framework
- **supertest** - HTTP testing
- **nodemon** - Auto-reload during development

## Architecture

The application follows a layered architecture:

1. **Routes** → Define API endpoints
2. **Controllers** → Handle HTTP requests/responses
3. **Repositories** → Database operations
4. **Models** → Data structures

This separation enables:
- Easy unit testing with mocks
- Clear separation of concerns
- Maintainable codebase

## License

MIT
