import { Global, Module } from "@nestjs/common";
import { DatabaseService } from "./database.service.ts";

@Global()
@Module({
    providers:[DatabaseService],
    exports:[DatabaseService],
})
export class DatabaseModule{}