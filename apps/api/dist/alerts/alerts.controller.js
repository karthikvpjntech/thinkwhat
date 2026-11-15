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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertsController = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const alerts_constants_1 = require("./alerts.constants");
const trigger_alert_dto_1 = require("./dto/trigger-alert.dto");
let AlertsController = class AlertsController {
    constructor(queue) {
        this.queue = queue;
    }
    async trigger(u, dto) {
        await this.queue.add('send', { userId: u.userId, shopId: dto.shopId, lat: dto.lat, lng: dto.lng, triggeredAt: new Date().toISOString() });
        return { queued: true };
    }
};
exports.AlertsController = AlertsController;
__decorate([
    (0, common_1.Post)('trigger'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, jwt_auth_guard_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, trigger_alert_dto_1.TriggerAlertDto]),
    __metadata("design:returntype", Promise)
], AlertsController.prototype, "trigger", null);
exports.AlertsController = AlertsController = __decorate([
    (0, common_1.Controller)('alerts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, bullmq_1.InjectQueue)(alerts_constants_1.ALERTS_QUEUE)),
    __metadata("design:paramtypes", [bullmq_2.Queue])
], AlertsController);
//# sourceMappingURL=alerts.controller.js.map