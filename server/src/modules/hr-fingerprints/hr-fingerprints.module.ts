import { Module } from '@nestjs/common';
import { HrFingerprintsService } from './hr-fingerprints.service.ts';
import { HrFingerprintsController } from './hr-fingerprints.controller.ts';

@Module({
  providers: [HrFingerprintsService],
  controllers: [HrFingerprintsController]
})
export class HrFingerprintsModule {}
