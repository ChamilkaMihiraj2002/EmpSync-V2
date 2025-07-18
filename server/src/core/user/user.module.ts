import {Module} from '@nestjs/common';
import { UserController } from './user.controller.ts';
import { UserService } from './user.service.ts';

@Module({
    controllers:[UserController],
    providers:[UserService],
     exports: [UserService],
})
export class UserModule{


}