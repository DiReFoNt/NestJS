import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  public async getTasks(filterParams: GetTasksFilterDto): Promise<Task[]> {
    return await this.tasksRepository.findTasksByFilter(filterParams);
  }

  public async getTaskById(id: string): Promise<Task> {
    const found = await this.tasksRepository.getById(id);

    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return found;
  }

  public async createTask({
    title,
    description,
  }: CreateTaskDto): Promise<Task> {
    return await this.tasksRepository.createTask({ title, description });
  }

  public async deleteTask(id: string): Promise<void> {
    const result = await this.tasksRepository.deleteTask(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
  }

  public async updateTaskStatus(id: string, status: TaskStatus) {
    const task = await this.tasksRepository.getById(id);
    if (task !== null) {
      task.status = status;
      return await this.tasksRepository.updateTaskStatus(task);
    } else {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
  }
}
