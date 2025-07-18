import { Module } from '@nestjs/common';
import { ScheduledMealService } from './schedule.service.ts';
import { ScheduledMealController } from './schedule.controller.ts';
import { ScheduleCleanupService } from './schedule-cleanup.service.ts';



@Module({
  controllers: [ScheduledMealController],
  providers: [ScheduledMealService,ScheduleCleanupService],
  exports: [ScheduledMealService],
})
export class ScheduleModule {}
