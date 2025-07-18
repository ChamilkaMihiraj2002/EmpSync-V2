import { Module } from '@nestjs/common';
import { IngredientsService } from './ingredient.service.ts';
import { IngredientsController } from './ingredient.controller.ts';

@Module({
  controllers: [IngredientsController],
  providers: [IngredientsService],
})
export class IngredientsModule {}
