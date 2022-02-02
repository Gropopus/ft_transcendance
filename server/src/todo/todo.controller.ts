import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { toPromise } from '../shared/utils';
import { TodoDto } from './dto/todo.dto';
import { TodoCreateDto } from './dto/todo.create.dto';
import { TodoService } from './todo.service';
import { TodoListDto } from './dto/todo.list.dto';


@Controller("api/todos")
export class TodoController {
    /** 1 */
    constructor(private readonly todoService: TodoService) {}
    @Get()
    /** 2 */
    // async findAll(): Promise<TodoListDto> {
    //     /** 3 */
    //     const todos = await this.todoService.getAllTodo();
    //
    //     /** 4 */     return toPromise({ todos });
    // }

    /** 5 */
    @Get(":id")
    async findOne(@Param("id") id: string): Promise<TodoDto> {
        return await this.todoService.getOneTodo(id);
    }
    //
    // /** 6 */
    // @Post()
    //
    // /** 7 */
    // async create(@Body() todoCreateDto: TodoCreateDto): Promise<TodoDto> {
    //     return await this.todoService.createTodo(todoCreateDto);
    // }
    //
    // @Put(":id")
    //
    // /** 8 */
    // async update(
    //     @Param("id") id: string,
    //     @Body() todoDto: TodoDto
    // ): Promise<TodoDto> {
    // return await this.todoService.updateTodo(todoDto);
    // }
    //
    // @Delete(":id")
    // async destroy(@Param("id") id: string): Promise<TodoDto> {
    //     return await this.todoService.destroyTodo(id);
    // }
}
