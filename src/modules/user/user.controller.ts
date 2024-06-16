import * as http from 'http';
import UserService from './user.service';
import { MaskedUser, NewUser, User } from '../interfaces';

export default class UserController {
  static createUser(req: http.IncomingMessage, res: http.ServerResponse): void {
    try {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const userData: NewUser = JSON.parse(body);
        const user: MaskedUser = UserService.createUser(userData);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
      });
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: error.message }));
    }
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
    try {
      const userId = req.url?.split('/')[4];
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const userData: Partial<User> = JSON.parse(body);
        const user: MaskedUser = UserService.updateUser(userId!, userData);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
      });
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
