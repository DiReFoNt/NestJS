import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  public async getTasks(
    filterParams: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    return await this.tasksRepository.findTasksByFilter(filterParams, user);
  }

  public async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.tasksRepository.getById(id, user);

    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return found;
  }

  public async createTask(
    { title, description }: CreateTaskDto,
    user: User,
  ): Promise<Task> {
    return await this.tasksRepository.createTask({ title, description }, user);
  }

  public async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.tasksRepository.deleteTask(id, user);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
  }

  public async updateTaskStatus(id: string, status: TaskStatus, user: User) {
    const task = await this.tasksRepository.getById(id, user);
    if (task !== null) {
      task.status = status;
      return await this.tasksRepository.updateTaskStatus(task);
    } else {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
  }
}
