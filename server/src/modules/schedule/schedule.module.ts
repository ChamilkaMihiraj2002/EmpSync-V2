import { Module } from '@nestjs/common';
import { ScheduledMealService } from './schedule.service';
import { ScheduledMealController } from './schedule.controller';




@Module({
  controllers: [ScheduledMealController],
  providers: [ScheduledMealService],
  exports: [ScheduledMealService],
})
export class ScheduleModule {}
