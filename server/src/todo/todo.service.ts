import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { TodoEntity } from '@todo/entity/todo.entity';
import { TodoCreateDto } from './dto/todo.create.dto';
import { TodoDto } from './dto/todo.dto';
import { toTodoDto } from '../shared/mapper';
import { toPromise } from '../shared/utils';

import { todos } from 'src/mock/todos.mock';
import {v4 as uuidv4} from 'uuid';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TodoService {
    constructor(
        @InjectRepository(TodoEntity)
        private readonly todoRepo: Repository<TodoEntity>,
    ) {}
    /** 1 */
    todos: TodoEntity[] = todos;

    async getOneTodo(id: string): Promise<TodoDto> {
      const todo = this.todos.find(todo => todo.id === id);

      if (!todo) {
        throw new HttpException(`Todo item doesn't exist`, HttpStatus.BAD_REQUEST);
      }

      return toPromise(toTodoDto(todo));
    }

    async createTodo(todoDto: TodoCreateDto): Promise<TodoDto> {
      const { name, description } = todoDto;

      const todo: TodoEntity = {
          id: uuidv4(),
          name,
          description,
      };

      this.todos.push(todo);
      return toPromise(toTodoDto(todo));
    }

    async getAllTodo(): Promise<TodoDto[]> {
      const todos = await this.todoRepo.find({ relations: ['tasks', 'owner'] });
      console.log('test');
      return todos.map(todo => toTodoDto(todo));
    }

// rest of the service has been removed for brevity

  // async updateTodo(id: string, todoDto: TodoDto): Promise<TodoDto> {
  //   const { name, description } = todoDto;
  //
  //   let todo: TodoEntity = await this.todoRepo.findOne({ where: { id } });
  //
  //   if (!todo) {
  //     throw new HttpException(
  //       `Todo list doesn't exist`,
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //
  //   todo = {
  //     id,
  //     name,
  //     description,
  //   };
  //
  //   await this.todoRepo.update({ id }, todo); // update
  //
  //   todo = await this.todoRepo.findOne({
  //     where: { id },
  //     relations: ['tasks', 'owner'],
  //   }); // re-query
  //
  //   return toTodoDto(todo);
  // }
  //
  // async destroyTodo(id: string): Promise<TodoDto> {
  //   const todo: TodoEntity = await this.todoRepo.findOne({
  //     where: { id },
  //     relations: ['tasks', 'owner'],
  //   });
  //
  //   if (!todo) {
  //     throw new HttpException(
  //       `Todo list doesn't exist`,
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //
  //   if (todo.tasks && todo.tasks.length > 0) {
  //     throw new HttpException(
  //       `Cannot delete this Todo list, it has existing tasks`,
  //       HttpStatus.FORBIDDEN,
  //     );
  //   }
  //
  //   await this.todoRepo.delete({ id }); // delete todo list
  //
  //   return toTodoDto(todo);
  // }
}
