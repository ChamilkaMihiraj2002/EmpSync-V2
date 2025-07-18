import { Module } from '@nestjs/common';
import { OrdersService } from './order.service.ts';
import { OrdersController } from './order.controller.ts';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
