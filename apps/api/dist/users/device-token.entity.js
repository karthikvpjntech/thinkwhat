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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceToken = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
let DeviceToken = class DeviceToken {
};
exports.DeviceToken = DeviceToken;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DeviceToken.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)({ unique: true }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DeviceToken.prototype, "token", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'android' }),
    __metadata("design:type", String)
], DeviceToken.prototype, "platform", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], DeviceToken.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (u) => u.deviceTokens, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], DeviceToken.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'last_seen_at' }),
    __metadata("design:type", Date)
], DeviceToken.prototype, "lastSeenAt", void 0);
exports.DeviceToken = DeviceToken = __decorate([
    (0, typeorm_1.Entity)('device_tokens')
], DeviceToken);
//# sourceMappingURL=device-token.entity.js.map