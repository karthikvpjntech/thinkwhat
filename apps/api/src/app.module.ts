import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AlertsModule } from './alerts/alerts.module';
import { RedisModule } from './redis/redis.module';
import { FirebaseModule } from './firebase/firebase.module';

const isMock = process.env.MOCK_SERVICES === 'true' || !process.env.DATABASE_URL;

const imports: any[] = [
  ConfigModule.forRoot({ isGlobal: true }),
  TypeOrmModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (c: ConfigService) => {
      const mock = c.get('MOCK_SERVICES') === 'true' || !c.get('DATABASE_URL');
      if (mock) {
        return {
          type: 'sqljs',
          autoLoadEntities: true,
          synchronize: true,
          location: './dev.sqlite',
          autoSave: true,
        };
      }
      return {
        type: 'postgres',
        url: c.get('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: false, // use migrations in prod
      };
    },
  }),
  RedisModule,
  FirebaseModule,
  UsersModule,
  AuthModule,
  AlertsModule,
];

if (!isMock) {
  imports.push(
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (c: ConfigService) => ({
        connection: { host: c.get('REDIS_HOST', 'localhost'), port: +c.get('REDIS_PORT', 6379) },
      }),
    }),
  );
}

@Module({
  imports,
})
export class AppModule {}
