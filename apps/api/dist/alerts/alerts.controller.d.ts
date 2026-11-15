import { Queue } from 'bullmq';
import { JwtUser } from '../auth/jwt-access.strategy';
import { AlertJob } from './alerts.constants';
import { TriggerAlertDto } from './dto/trigger-alert.dto';
export declare class AlertsController {
    private queue;
    constructor(queue: Queue<AlertJob>);
    trigger(u: JwtUser, dto: TriggerAlertDto): Promise<{
        queued: boolean;
    }>;
}
