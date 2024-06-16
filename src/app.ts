import * as http from 'http';
import UserController from './modules/user/user.controller';
import TaskController from './modules/task/task.controller';
import ListController from './modules/list/list.controller';
import DatabaseService from './modules/database/database.service';

// DATABASE
DatabaseService.init();

// ROUTER

// MIDDLEWARE

// ROUTES

// SERVER
const PORT = 3000;
const server = http.createServer((req, res) => {
  const { method, url } = req;

  switch (true) {
    case url === `/api` && method === 'GET':
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Hello World!');
      break;

    case url === `/api/users/register` && method === 'POST':
      UserController.createUser(req, res);
      break;
    case url?.startsWith(`/api/users/user/`) && method === 'GET':
      UserController.retrieveUser(req, res);
      break;
    case url?.startsWith(`/api/users/user/`) && method === 'PUT':
      UserController.updateUser(req, res);
      break;
    case url?.startsWith(`/api/users/user/`) && method === 'DELETE':
      UserController.deleteUser(req, res);
      break;

    case url === `/api/tasks/create` && method === 'POST':
      TaskController.createTask(req, res);
      break;
    case url?.startsWith(`/api/tasks/task/`) && method === 'GET':
      TaskController.retrieveTask(req, res);
      break;
    case url?.startsWith(`/api/tasks/task/`) && method === 'PUT':
      TaskController.updateTask(req, res);
      break;
    case url?.startsWith(`/api/tasks/task/`) && method === 'DELETE':
      TaskController.deleteTask(req, res);
      break;
    case url?.startsWith(`/api/tasks/task/`) &&
      url?.endsWith('/complete') &&
      method === 'PATCH':
      TaskController.completeTask(req, res);
      break;

    case url === `/api/lists/create` && method === 'POST':
      ListController.createList(req, res);
      break;
    case url?.startsWith(`/api/lists/list/`) && method === 'GET':
      ListController.retrieveList(req, res);
      break;
    case url?.startsWith(`/api/lists/list/`) && method === 'PUT':
      ListController.updateList(req, res);
      break;
    case url?.startsWith(`/api/lists/list/`) && method === 'DELETE':
      ListController.deleteList(req, res);
      break;
    default:
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Route not found' }));
      break;
  }
});

server.on('error', (err) => {
  console.error('Server error:', err);
});
server.on('clientError', (err, socket) => {
  console.error('Client error:', err);
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
