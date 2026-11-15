export const ALERTS_QUEUE = 'proximity-alerts';
export interface AlertJob { userId: string; shopId: string; lat?: number; lng?: number; triggeredAt: string; }
