import { Logger, Module } from '@nestjs/common';
import { BullModule, getQueueToken } from '@nestjs/bullmq';
import { UsersModule } from '../users/users.module';
import { ALERTS_QUEUE } from './alerts.constants';
import { AlertsController } from './alerts.controller';
import { AlertsProcessor } from './alerts.processor';
import { DebounceService } from './debounce.service';

const isMock = process.env.MOCK_SERVICES === 'true' || !process.env.REDIS_HOST;

const providers: any[] = [AlertsProcessor, DebounceService];
const imports: any[] = [UsersModule];

if (!isMock) {
  imports.push(
    BullModule.registerQueue({
      name: ALERTS_QUEUE,
      defaultJobOptions: { attempts: 3, backoff: { type: 'exponential', delay: 2000 }, removeOnComplete: 1000, removeOnFail: 5000 },
    }),
  );
} else {
  providers.push({
    provide: getQueueToken(ALERTS_QUEUE),
    inject: [AlertsProcessor],
    useFactory: (processor: AlertsProcessor) => ({
      add: async (name: string, data: any) => {
        const logger = new Logger('MockQueue');
        logger.log(`[Mock Queue] Job '${name}' enqueued: ${JSON.stringify(data)}`);
        setImmediate(async () => {
          try {
            await processor.process({ data } as any);
          } catch (err: any) {
            logger.error(`Error processing job '${name}': ${err?.message}`);
          }
        });
        return { id: 'mock-job-' + Date.now() };
      },
    }),
  });
}

@Module({
  imports,
  controllers: [AlertsController],
  providers,
})
export class AlertsModule {}
