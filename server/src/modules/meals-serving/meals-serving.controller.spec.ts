import { Test, TestingModule } from '@nestjs/testing';
import { MealsServingController } from './meals-serving.controller.ts';
import { MealsServingService } from './meals-serving.service.ts';

describe('MealsServingController', () => {
  let controller: MealsServingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MealsServingController],
      providers: [
        {
          provide: MealsServingService,
          useValue: {
            serveMeal: jest.fn(),
            cancelMeal: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MealsServingController>(MealsServingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
