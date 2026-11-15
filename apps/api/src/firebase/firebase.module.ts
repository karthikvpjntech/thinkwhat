import { Global, Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

export const FIREBASE = Symbol('FIREBASE');

@Global()
@Module({
  providers: [{
    provide: FIREBASE,
    inject: [ConfigService],
    useFactory: (c: ConfigService) => {
      const isMock = c.get('MOCK_SERVICES') === 'true' || !c.get('FIREBASE_SERVICE_ACCOUNT_JSON');
      if (isMock) {
        const logger = new Logger('FirebaseMock');
        logger.log('Initialized in mock mode (simulated FCM notifications)');
        return {
          messaging: () => ({
            sendEachForMulticast: async (payload: any) => {
              logger.log(`[Mock FCM] Multicast notification sent to ${payload.tokens?.length ?? 0} tokens: ${JSON.stringify(payload.notification)}`);
              return {
                successCount: payload.tokens?.length ?? 0,
                failureCount: 0,
                responses: (payload.tokens || []).map(() => ({ success: true })),
              };
            },
          }),
        } as unknown as admin.app.App;
      }
      return admin.apps.length
        ? admin.app()
        : admin.initializeApp({ credential: admin.credential.cert(JSON.parse(c.getOrThrow('FIREBASE_SERVICE_ACCOUNT_JSON'))) });
    },
  }],
  exports: [FIREBASE],
})
export class FirebaseModule {}
