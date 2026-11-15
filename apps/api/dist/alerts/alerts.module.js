"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertsModule = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const users_module_1 = require("../users/users.module");
const alerts_constants_1 = require("./alerts.constants");
const alerts_controller_1 = require("./alerts.controller");
const alerts_processor_1 = require("./alerts.processor");
const debounce_service_1 = require("./debounce.service");
const isMock = process.env.MOCK_SERVICES === 'true' || !process.env.REDIS_HOST;
const providers = [alerts_processor_1.AlertsProcessor, debounce_service_1.DebounceService];
const imports = [users_module_1.UsersModule];
if (!isMock) {
    imports.push(bullmq_1.BullModule.registerQueue({
        name: alerts_constants_1.ALERTS_QUEUE,
        defaultJobOptions: { attempts: 3, backoff: { type: 'exponential', delay: 2000 }, removeOnComplete: 1000, removeOnFail: 5000 },
    }));
}
else {
    providers.push({
        provide: (0, bullmq_1.getQueueToken)(alerts_constants_1.ALERTS_QUEUE),
        inject: [alerts_processor_1.AlertsProcessor],
        useFactory: (processor) => ({
            add: async (name, data) => {
                const logger = new common_1.Logger('MockQueue');
                logger.log(`[Mock Queue] Job '${name}' enqueued: ${JSON.stringify(data)}`);
                setImmediate(async () => {
                    try {
                        await processor.process({ data });
                    }
                    catch (err) {
                        logger.error(`Error processing job '${name}': ${err?.message}`);
                    }
                });
                return { id: 'mock-job-' + Date.now() };
            },
        }),
    });
}
let AlertsModule = class AlertsModule {
};
exports.AlertsModule = AlertsModule;
exports.AlertsModule = AlertsModule = __decorate([
    (0, common_1.Module)({
        imports,
        controllers: [alerts_controller_1.AlertsController],
        providers,
    })
], AlertsModule);
//# sourceMappingURL=alerts.module.js.map