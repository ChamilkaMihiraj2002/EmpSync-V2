import { Module } from '@nestjs/common';
import { MealService } from './meal.service.ts';
import { MealController } from './meal.controller.ts';

@Module({
  controllers: [MealController],
  providers: [MealService],
})
export class MealModule {}
