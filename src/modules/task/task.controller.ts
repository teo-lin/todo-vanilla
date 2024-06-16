import * as http from 'http';
import TaskService from './task.service';
import { NewTask, Task } from '../interfaces';

export default class TaskController {
  static createTask(req: http.IncomingMessage, res: http.ServerResponse): void {
    try {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const taskData: NewTask = JSON.parse(body);
        const task: Task = TaskService.createTask(taskData);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(task));
      });
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: error.message }));
    }
  }

  static retrieveTask(req: http.IncomingMessage, res: http.ServerResponse): void {
    try {
      const taskId = req.url?.split('/')[4];
      const task: Task = TaskService.retrieveTask(taskId!);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(task));
    } catch (error) {
      if (error.message === 'Not Found') {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Task not found' }));
      } else {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
      }
    }
  }

  static updateTask(req: http.IncomingMessage, res: http.ServerResponse): void {
    try {
      const taskId = req.url?.split('/')[4];
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const taskData: Partial<Task> = JSON.parse(body);
        const task: Task = TaskService.updateTask(taskId!, taskData);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(task));
      });
    } catch (error) {
      if (error.message === 'Not Found') {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Task not found' }));
      } else {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
      }
    }
  }

  static deleteTask(req: http.IncomingMessage, res: http.ServerResponse): void {
    try {
      const taskId = req.url?.split('/')[4];
      TaskService.deleteTask(taskId!);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Task deleted successfully' }));
    } catch (error) {
      if (error.message === 'Not Found') {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Task not found' }));
      } else {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
      }
    }
  }

  static completeTask(req: http.IncomingMessage, res: http.ServerResponse): void {
    try {
      const taskId = req.url?.split('/')[4];
      const task: Task = TaskService.completeTask(taskId!);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(task));
    } catch (error) {
      if (error.message === 'Not Found') {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Task not found' }));
      } else {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
      }
    }
  }
}
