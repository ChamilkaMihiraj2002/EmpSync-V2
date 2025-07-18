import { Module } from "@nestjs/common";
import { SuperAdminController } from "./super-admin.controller.ts";
import { SuperAdminService } from './super-admin.service.ts';
import { PassportModule } from '@nestjs/passport';
import { DatabaseService } from "src/database/database.service.ts";
import { SuperAdminJwtStrategy } from "src/core/super-admin-auth/superadmin-jwt.strategy.ts";

@Module({
      imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    
  ],
    controllers:[SuperAdminController],
    providers: [SuperAdminService, SuperAdminJwtStrategy,DatabaseService],
    exports: [SuperAdminService, SuperAdminJwtStrategy, PassportModule],
})
export class SuperAdminModule{
    
}