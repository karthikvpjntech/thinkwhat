import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import * as admin from 'firebase-admin';
import { UsersService } from '../users/users.service';
import { AlertJob } from './alerts.constants';
import { DebounceService } from './debounce.service';
export declare class AlertsProcessor extends WorkerHost {
    private fb;
    private users;
    private debounce;
    private log;
    constructor(fb: admin.app.App, users: UsersService, debounce: DebounceService);
    process(job: Job<AlertJob>): Promise<{
        skipped: string;
        sent?: undefined;
    } | {
        sent: number;
        skipped?: undefined;
    }>;
}
