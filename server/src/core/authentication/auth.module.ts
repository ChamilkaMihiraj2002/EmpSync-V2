import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service.ts';
import { AuthController } from './auth.controller.ts';
import { JwtStrategy } from './jwt.strategy.ts';
import { passportJwtSecret } from 'jwks-rsa';
import { UserModule } from '../user/user.module.ts'; // <-- Add this line


@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }), // Register jwt strategy
  UserModule,],

  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy, PassportModule], // Export for use in other modules
})
export class AuthModule {}
