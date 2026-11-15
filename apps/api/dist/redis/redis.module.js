"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisModule = exports.REDIS = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = require("ioredis");
const RedisMock = require('ioredis-mock');
exports.REDIS = Symbol('REDIS');
let RedisModule = class RedisModule {
};
exports.RedisModule = RedisModule;
exports.RedisModule = RedisModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [{
                provide: exports.REDIS,
                inject: [config_1.ConfigService],
                useFactory: (c) => {
                    const isMock = c.get('MOCK_SERVICES') === 'true' || !c.get('REDIS_HOST');
                    if (isMock) {
                        return new RedisMock();
                    }
                    return new ioredis_1.default({ host: c.get('REDIS_HOST'), port: +c.get('REDIS_PORT', 6379) });
                },
            }],
        exports: [exports.REDIS],
    })
], RedisModule);
//# sourceMappingURL=redis.module.js.map