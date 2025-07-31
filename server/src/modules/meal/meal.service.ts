import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class MealService {
  constructor(private readonly databaseService: DatabaseService) {}

  
  async createWithIngredients(
    mealData: Omit<Prisma.MealCreateInput, 'ingredients'>,
    orgId?: string,
  ) {
    try {
      const data: any = {
        ...mealData,
        orgId: orgId || undefined,
      };
      const result = await this.databaseService.meal.create({
        data,
      });
      return result;
    } catch (error) {
      throw new BadRequestException(`Failed to create meal: ${error.message}`);
    }
  }


  async findOneWithIngredients(id: number, orgId?: string) {
    try {
      return await this.databaseService.meal.findFirst({
        where: {
          id,
          orgId: orgId || undefined,
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to retrieve meal');
    }
  }


  async findAllWithIngredients(orgId?: string, includeDeleted = false) {
  try {
    return await this.databaseService.meal.findMany({
      where: {
        orgId: orgId || undefined,
        ...(includeDeleted ? {} : { isDeleted: false }),
      },
    });
  } catch (error) {
    throw new BadRequestException('Failed to retrieve meals');
  }
}


  async updateWithIngredients(
  id: number,
  mealData: Omit<Prisma.MealUpdateInput, 'ingredients'>,
  ingredients?: Array<{ ingredientId: number }>,
  orgId?: string,
) {
  // First check: only throw NotFoundException if meal not found
  const meal = await this.databaseService.meal.findFirst({
    where: {
      id,
      orgId: orgId || undefined,
    },
  });

  if (!meal) {
    throw new NotFoundException('Meal not found');
  }

  try {
    return await this.databaseService.$transaction(async (prisma) => {
      const updatedMeal = await prisma.meal.update({
        where: { id },
        data: mealData,
      });

      return updatedMeal;
    });
  } catch (error) {
    throw new BadRequestException(`Failed to update meal: ${error.message}`);
  }
}


  

  async softDelete(id: number, orgId?: string) {
  const meal = await this.databaseService.meal.findFirst({
    where: {
      id,
      orgId: orgId || undefined,
    },
  });

  if (!meal) {
    throw new NotFoundException('Meal not found');
  }

  return await this.databaseService.meal.update({
    where: { id },
    data: {
      isDeleted: true,
    },
  });
}



}