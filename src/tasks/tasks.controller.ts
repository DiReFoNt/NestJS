import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDTO } from './dto/update-task.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query() model: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksService.getTasks(model);
  }

  @Get('/:id')
  getTaskById(@Param() { id }: any): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  createTask(@Body() model: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(model);
  }

  @Delete('/:id')
  deleteTask(@Param() { id }: any) {
    return this.tasksService.deleteTask(id);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() model: UpdateTaskStatusDTO,
  ) {
    const { status } = model;
    return this.tasksService.updateTaskStatus(id, status);
  }
}
