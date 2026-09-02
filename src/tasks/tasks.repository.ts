import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { v4 as uuid } from 'uuid';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksRepository {
  private logger = new Logger('TasksRepository', { timestamp: true });

  constructor(
    @InjectRepository(Task)
    private repository: Repository<Task>,
  ) {}

  findTasksByFilter(
    filterParams: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    const { status, search } = filterParams;

    const query = this.repository.createQueryBuilder('task');

    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(task.title ILIKE :search OR task.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    try {
      return query.getMany();
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${user.username}". Filters: ${JSON.stringify(filterParams)})`,
      );
      throw new InternalServerErrorException(error);
    }
  }

  async createTask(
    { title, description }: CreateTaskDto,
    user: User,
  ): Promise<Task> {
    const task = this.repository.create({
      id: uuid(),
      title: title,
      description: description,
      status: TaskStatus.OPEN,
      user: user,
    });

    return await this.repository.save(task);
  }

  async getById(id: string, user: User): Promise<Task | null> {
    return await this.repository.findOne({
      where: {
        id,
        user: {
          id: user.id,
        },
      },
    });
  }

  async deleteTask(id: string, user: User): Promise<DeleteResult> {
    return await this.repository.delete({
      id: id,
      user: {
        id: user.id,
      },
    });
  }

  async updateTaskStatus(task: Task): Promise<Task> {
    return await this.repository.save(task);
  }
}
