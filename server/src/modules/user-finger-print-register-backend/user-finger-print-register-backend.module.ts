import { Module } from '@nestjs/common';
import { UserFingerPrintRegisterBackendController } from './user-finger-print-register-backend.controller.ts';
import { UserFingerPrintRegisterBackendService } from './user-finger-print-register-backend.service.ts';

@Module({
  controllers: [UserFingerPrintRegisterBackendController],
  providers: [UserFingerPrintRegisterBackendService],
})
export class UserFingerPrintRegisterBackendModule {}
