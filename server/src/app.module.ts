import { Module } from '@nestjs/common';
import { AppController } from './app.controller.ts';
import { AppService } from './app.service.ts';
import { DatabaseModule } from './database/database.module.ts';
import { UserModule } from './core/user/user.module.ts';
import { MealModule } from './modules/meal/meal.module.ts';
import { IngredientsModule } from './modules/ingredient/ingredient.module.ts';
import { OrdersModule } from './modules/order/order.module.ts';
import { ScheduleModule } from './modules/schedule/schedule.module.ts';
import { AuthModule } from './core/authentication/auth.module.ts';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';
import { MealsServingModule } from './modules/meals-serving/meals-serving.module.ts';
import { MealTypeModule } from './modules/meal-type/meal-type.module.ts';
import { SuperAdminModule } from './modules/SuperAdmin/super-admin.module.ts';
import { SuperAdminAuthModule } from './core/super-admin-auth/superadmin-auth.module.ts';
import { UserFingerPrintRegisterBackendModule } from './modules/user-finger-print-register-backend/user-finger-print-register-backend.module.ts';
import { UserFingerPrintRegisterBackendService } from './modules/user-finger-print-register-backend/user-finger-print-register-backend.service.ts';
import { UserFingerPrintRegisterBackendController } from './modules/user-finger-print-register-backend/user-finger-print-register-backend.controller.ts';
import { HrFingerprintsModule } from './modules/hr-fingerprints/hr-fingerprints.module.ts';

@Module({
  imports: [
    NestScheduleModule.forRoot(),
    DatabaseModule,
    UserModule,
    IngredientsModule,
    MealModule,
    OrdersModule,
    SuperAdminAuthModule,
    ScheduleModule,
    MealTypeModule,
    AuthModule,
    MealsServingModule,
    SuperAdminModule,
    UserFingerPrintRegisterBackendModule,
    HrFingerprintsModule,
  ],
  controllers: [AppController, UserFingerPrintRegisterBackendController],
  providers: [AppService, UserFingerPrintRegisterBackendService],
})
export class AppModule {}
