import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import {
  DeleteResult,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { v4 as uuid } from 'uuid';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksRepository {
  constructor(
    @InjectRepository(Task)
    private repository: Repository<Task>,
  ) {}

  findTasksByFilter(filterParams: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterParams;

    const query = this.repository.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(task.title ILIKE :search OR task.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    return query.getMany();
  }

  async createTask({ title, description }: CreateTaskDto): Promise<Task> {
    const task = this.repository.create({
      id: uuid(),
      title: title,
      description: description,
      status: TaskStatus.OPEN,
    });

    return await this.repository.save(task);
  }

  async getById(id: string): Promise<Task | null> {
    return await this.repository.findOne({ where: { id: id } });
  }

  async deleteTask(id: string): Promise<DeleteResult> {
    return await this.repository.delete({
      id: id,
    });
  }

  async updateTaskStatus(task: Task): Promise<Task> {
    return await this.repository.save(task);
  }
}
