import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

const mockTasksRepository = () => ({
  findTasksByFilter: jest.fn(),
  getById: jest.fn(),
});

const mockUser = {
  id: '1',
  username: 'Ariel',
  password: '123456',
  tasks: [],
};

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    const module = Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    tasksService = (await module).get(TasksService);
    tasksRepository = (await module).get(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.findTasksByFilter and return the result', async () => {
      expect(tasksRepository.findTasksByFilter).not.toHaveBeenCalled();
      tasksRepository.findTasksByFilter.mockResolvedValue('someValue');
      const result = await tasksService.getTasks({}, mockUser);
      expect(tasksRepository.findTasksByFilter).toHaveBeenCalled();
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    it('call TasksRepository.getById and return the task', async () => {
      const mockTask = {
        id: 12,
        title: 'Ariel task',
        description: 'Ariel task description',
        status: TaskStatus.IN_PROGRESS,
        user: mockUser,
      };

      expect(tasksRepository.getById).not.toHaveBeenCalled();
      tasksRepository.getById.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById('someId', mockUser);
      expect(tasksRepository.getById).toHaveBeenCalled();
      expect(result).toEqual(mockTask);
    });

    it('call TasksRepository.getById and handle error', async () => {
      tasksRepository.getById.mockResolvedValue(null);

      expect(tasksService.getTaskById('someId', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
