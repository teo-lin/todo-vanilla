import * as http from 'http';
import UserService from './user.service';
import { MaskedUser, NewUser, User } from '../interfaces';

export default class UserController {
  static createUser(req: http.IncomingMessage, res: http.ServerResponse): void {
    let body = '';
    req.on('data', (chunk) => (body += chunk.toString()));
    req.on('end', () => {
      try {
        const userData: NewUser = body ? JSON.parse(body) : {};
        // const userData: NewUser = JSON.parse(body); // with proper error handling
        const user: MaskedUser = UserService.createUser(userData);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
      } catch (error) {
        if (error instanceof SyntaxError) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Invalid JSON format' }));
        } else {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: error.message }));
        }
      }
    });
  }

  static retrieveUser(req: http.IncomingMessage, res: http.ServerResponse): void {
    try {
      const userId = req.url?.split('/')[4];
      const user: MaskedUser = UserService.retrieveUser(userId!);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    } catch (error) {
      if (error.message === 'Not Found') {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User not found' }));
      } else {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
      }
    }
  }

  static updateUser(req: http.IncomingMessage, res: http.ServerResponse): void {
    const userId = req.url?.split('/')[4];
    let body = '';
    req.on('data', (chunk) => (body += chunk.toString()));
    req.on('end', () => {
      try {
        const userData: Partial<User> = JSON.parse(body);
        const user: MaskedUser = UserService.updateUser(userId!, userData);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
      } catch (error) {
        if (error instanceof SyntaxError) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Invalid JSON format' }));
        } else if (error.message === 'Not Found') {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'User not found' }));
        } else {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: error.message }));
        }
      }
    });
  }

  static deleteUser(req: http.IncomingMessage, res: http.ServerResponse): void {
    try {
      const userId = req.url?.split('/')[4];
      UserService.deleteUser(userId!);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User deleted successfully' }));
    } catch (error) {
      if (error.message === 'Not Found') {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User not found' }));
      } else {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
      }
    }
  }
}
