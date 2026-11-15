import { Inject, Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import * as admin from 'firebase-admin';
import { FIREBASE } from '../firebase/firebase.module';
import { UsersService } from '../users/users.service';
import { ALERTS_QUEUE, AlertJob } from './alerts.constants';
import { DebounceService } from './debounce.service';

const STALE = new Set(['messaging/registration-token-not-registered', 'messaging/invalid-registration-token']);

@Processor(ALERTS_QUEUE, { concurrency: 10 })
export class AlertsProcessor extends WorkerHost {
  private log = new Logger(AlertsProcessor.name);
  constructor(@Inject(FIREBASE) private fb: admin.app.App, private users: UsersService, private debounce: DebounceService) { super(); }

  async process(job: Job<AlertJob>) {
    const { userId, shopId } = job.data;
    if (!(await this.debounce.acquire(userId, shopId))) {
      this.log.debug(`Debounced ${userId}/${shopId}`);
      return { skipped: 'debounced' };
    }
    try {
      const tokens = (await this.users.getDeviceTokens(userId)).map((t) => t.token);
      if (!tokens.length) return { skipped: 'no-tokens' };

      // TODO: look up shop + matching requirement for richer copy
      const res = await this.fb.messaging().sendEachForMulticast({
        tokens,
        notification: { title: 'A shop near you has what you need', body: 'Tap to see matching offers nearby.' },
        data: { type: 'proximity', shopId },
        android: { priority: 'high' },
        apns: { payload: { aps: { sound: 'default' } } },
      });
      await Promise.all(res.responses.map((r, i) =>
        !r.success && r.error && STALE.has(r.error.code) ? this.users.removeDeviceToken(tokens[i]) : null));
      if (res.successCount === 0) throw new Error('All FCM sends failed');
      return { sent: res.successCount };
    } catch (e) {
      await this.debounce.release(userId, shopId); // allow BullMQ retry
      throw e;
    }
  }
}
