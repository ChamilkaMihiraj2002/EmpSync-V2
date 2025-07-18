import { Module } from '@nestjs/common';
import { MealTypeService } from './meal-type.service.ts';
import { MealTypeController } from './meal-type.controller.ts';
import { ScheduleModule } from '../schedule/schedule.module.ts';

@Module({
  imports: [ScheduleModule],
  providers: [MealTypeService],
  controllers: [MealTypeController]
})
export class MealTypeModule {}
