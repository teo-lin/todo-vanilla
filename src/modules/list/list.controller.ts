import * as http from 'http';
import ListService from './list.service';
import { NewList, List } from '../interfaces';

export default class ListController {
  static createList(req: http.IncomingMessage, res: http.ServerResponse): void {
    let body = '';
    req.on('data', (chunk) => (body += chunk.toString()));
    req.on('end', () => {
      try {
        const listData: NewList = body ? JSON.parse(body) : {};
        // const listData: NewList = JSON.parse(body); // with proper error handling
        const list: List = ListService.createList(listData);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(list));
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

  static retrieveList(req: http.IncomingMessage, res: http.ServerResponse): void {
    try {
      const listId = req.url?.split('/')[4];
      const list: List = ListService.retrieveList(listId!);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(list));
    } catch (error) {
      if (error.message === 'Not Found') {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'List not found' }));
      } else {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
      }
    }
  }

  static updateList(req: http.IncomingMessage, res: http.ServerResponse): void {
    const listId = req.url?.split('/')[4];
    let body = '';
    req.on('data', (chunk) => (body += chunk.toString()));
    req.on('end', () => {
      try {
        const listData: Partial<List> = JSON.parse(body);
        const list: List = ListService.updateList(listId!, listData);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(list));
      } catch (error) {
        if (error instanceof SyntaxError) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Invalid JSON format' }));
        } else if (error.message === 'Not Found') {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'List not found' }));
        } else {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: error.message }));
        }
      }
    });
  }

  static deleteList(req: http.IncomingMessage, res: http.ServerResponse): void {
    try {
      const listId = req.url?.split('/')[4];
      ListService.deleteList(listId!);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'List deleted successfully' }));
    } catch (error) {
      if (error.message === 'Not Found') {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'List not found' }));
      } else {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
      }
    }
  }
}
