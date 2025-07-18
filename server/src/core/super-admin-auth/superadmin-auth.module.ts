import { SuperAdminJwtStrategy } from './superadmin-jwt.strategy.ts';
import { Module } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service.ts';
import { PassportModule } from '@nestjs/passport';
import { SuperAdminAuthController } from './superadmin-auth.controller.ts';
import { SuperAdminAuthService } from './superadmin-auth.service.ts';


@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    
  ],
  controllers: [SuperAdminAuthController],
  providers: [SuperAdminAuthService, SuperAdminJwtStrategy,DatabaseService], 
  exports: [SuperAdminAuthService, SuperAdminJwtStrategy, PassportModule],
})
export class SuperAdminAuthModule {}