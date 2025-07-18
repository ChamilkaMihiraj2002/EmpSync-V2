import { Module } from '@nestjs/common';
import { MealsServingService } from './meals-serving.service.ts';
import { MealsServingController } from './meals-serving.controller.ts';

@Module({
  providers: [MealsServingService],
  controllers: [MealsServingController]
})
export class MealsServingModule {}
