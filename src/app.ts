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
  const prefix = '/api';

  switch (true) {
    case method === 'GET' && url === `${prefix}`:
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Hello World!');
      break;
    case method === 'GET' && url?.startsWith(`${prefix}/users/user/`):
      UserController.retrieveUser(req, res);
      break;
    case method === 'POST' && url === `${prefix}/users/register`:
      UserController.createUser(req, res);
      break;
    case method === 'PUT' && url?.startsWith(`${prefix}/users/user/`):
      UserController.updateUser(req, res);
      break;
    case method === 'DELETE' && url?.startsWith(`${prefix}/users/user/`):
      UserController.deleteUser(req, res);
      break;
    case method === 'POST' && url === `${prefix}/tasks/create`:
      TaskController.createTask(req, res);
      break;
    case method === 'GET' && url?.startsWith(`${prefix}/tasks/task/`):
      TaskController.retrieveTask(req, res);
      break;
    case method === 'PUT' && url?.startsWith(`${prefix}/tasks/task/`):
      TaskController.updateTask(req, res);
      break;
    case method === 'DELETE' && url?.startsWith(`${prefix}/tasks/task/`):
      TaskController.deleteTask(req, res);
      break;
    case method === 'PATCH' &&
      url?.startsWith(`${prefix}/tasks/task/`) &&
      url?.endsWith('/complete'):
      TaskController.completeTask(req, res);
      break;
    case method === 'POST' && url === `${prefix}/lists/create`:
      ListController.createList(req, res);
      break;
    case method === 'GET' && url?.startsWith(`${prefix}/lists/list/`):
      ListController.retrieveList(req, res);
      break;
    case method === 'PUT' && url?.startsWith(`${prefix}/lists/list/`):
      ListController.updateList(req, res);
      break;
    case method === 'DELETE' && url?.startsWith(`${prefix}/lists/list/`):
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
