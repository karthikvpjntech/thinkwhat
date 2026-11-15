"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseModule = exports.FIREBASE = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const admin = require("firebase-admin");
exports.FIREBASE = Symbol('FIREBASE');
let FirebaseModule = class FirebaseModule {
};
exports.FirebaseModule = FirebaseModule;
exports.FirebaseModule = FirebaseModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [{
                provide: exports.FIREBASE,
                inject: [config_1.ConfigService],
                useFactory: (c) => {
                    const isMock = c.get('MOCK_SERVICES') === 'true' || !c.get('FIREBASE_SERVICE_ACCOUNT_JSON');
                    if (isMock) {
                        const logger = new common_1.Logger('FirebaseMock');
                        logger.log('Initialized in mock mode (simulated FCM notifications)');
                        return {
                            messaging: () => ({
                                sendEachForMulticast: async (payload) => {
                                    logger.log(`[Mock FCM] Multicast notification sent to ${payload.tokens?.length ?? 0} tokens: ${JSON.stringify(payload.notification)}`);
                                    return {
                                        successCount: payload.tokens?.length ?? 0,
                                        failureCount: 0,
                                        responses: (payload.tokens || []).map(() => ({ success: true })),
                                    };
                                },
                            }),
                        };
                    }
                    return admin.apps.length
                        ? admin.app()
                        : admin.initializeApp({ credential: admin.credential.cert(JSON.parse(c.getOrThrow('FIREBASE_SERVICE_ACCOUNT_JSON'))) });
                },
            }],
        exports: [exports.FIREBASE],
    })
], FirebaseModule);
//# sourceMappingURL=firebase.module.js.map