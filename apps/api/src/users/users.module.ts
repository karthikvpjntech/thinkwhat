import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { DeviceToken } from './device-token.entity';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, DeviceToken])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
