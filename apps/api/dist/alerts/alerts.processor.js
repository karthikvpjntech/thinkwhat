"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AlertsProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertsProcessor = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const admin = require("firebase-admin");
const firebase_module_1 = require("../firebase/firebase.module");
const users_service_1 = require("../users/users.service");
const alerts_constants_1 = require("./alerts.constants");
const debounce_service_1 = require("./debounce.service");
const STALE = new Set(['messaging/registration-token-not-registered', 'messaging/invalid-registration-token']);
let AlertsProcessor = AlertsProcessor_1 = class AlertsProcessor extends bullmq_1.WorkerHost {
    constructor(fb, users, debounce) {
        super();
        this.fb = fb;
        this.users = users;
        this.debounce = debounce;
        this.log = new common_1.Logger(AlertsProcessor_1.name);
    }
    async process(job) {
        const { userId, shopId } = job.data;
        if (!(await this.debounce.acquire(userId, shopId))) {
            this.log.debug(`Debounced ${userId}/${shopId}`);
            return { skipped: 'debounced' };
        }
        try {
            const tokens = (await this.users.getDeviceTokens(userId)).map((t) => t.token);
            if (!tokens.length)
                return { skipped: 'no-tokens' };
            const res = await this.fb.messaging().sendEachForMulticast({
                tokens,
                notification: { title: 'A shop near you has what you need', body: 'Tap to see matching offers nearby.' },
                data: { type: 'proximity', shopId },
                android: { priority: 'high' },
                apns: { payload: { aps: { sound: 'default' } } },
            });
            await Promise.all(res.responses.map((r, i) => !r.success && r.error && STALE.has(r.error.code) ? this.users.removeDeviceToken(tokens[i]) : null));
            if (res.successCount === 0)
                throw new Error('All FCM sends failed');
            return { sent: res.successCount };
        }
        catch (e) {
            await this.debounce.release(userId, shopId);
            throw e;
        }
    }
};
exports.AlertsProcessor = AlertsProcessor;
exports.AlertsProcessor = AlertsProcessor = AlertsProcessor_1 = __decorate([
    (0, bullmq_1.Processor)(alerts_constants_1.ALERTS_QUEUE, { concurrency: 10 }),
    __param(0, (0, common_1.Inject)(firebase_module_1.FIREBASE)),
    __metadata("design:paramtypes", [Object, users_service_1.UsersService, debounce_service_1.DebounceService])
], AlertsProcessor);
//# sourceMappingURL=alerts.processor.js.map