import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { JwtAuthGuard, CurrentUser } from '../auth/jwt-auth.guard';
import { JwtUser } from '../auth/jwt-access.strategy';
import { ALERTS_QUEUE, AlertJob } from './alerts.constants';
import { TriggerAlertDto } from './dto/trigger-alert.dto';

@Controller('alerts')
@UseGuards(JwtAuthGuard)
export class AlertsController {
  constructor(@InjectQueue(ALERTS_QUEUE) private queue: Queue<AlertJob>) {}

  /** Fire-and-forget: enqueue and return 200 immediately. */
  @Post('trigger') @HttpCode(200)
  async trigger(@CurrentUser() u: JwtUser, @Body() dto: TriggerAlertDto) {
    await this.queue.add('send', { userId: u.userId, shopId: dto.shopId, lat: dto.lat, lng: dto.lng, triggeredAt: new Date().toISOString() });
    return { queued: true };
  }
}
