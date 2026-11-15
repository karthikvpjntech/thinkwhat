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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    constructor(users, jwt, cfg) {
        this.users = users;
        this.jwt = jwt;
        this.cfg = cfg;
    }
    async signUp(dto) {
        if (await this.users.findByEmailWithSecrets(dto.email))
            throw new common_1.ConflictException('Email already registered');
        const user = await this.users.create({
            email: dto.email.toLowerCase(), name: dto.name, passwordHash: await bcrypt.hash(dto.password, 12),
        });
        if (dto.fcmToken)
            await this.users.upsertDeviceToken(user.id, dto.fcmToken, dto.platform ?? 'android');
        return this.issueTokens(user.id, user.email);
    }
    async signIn(dto) {
        const user = await this.users.findByEmailWithSecrets(dto.email);
        if (!user || !(await bcrypt.compare(dto.password, user.passwordHash)))
            throw new common_1.UnauthorizedException('Invalid credentials');
        if (dto.fcmToken)
            await this.users.upsertDeviceToken(user.id, dto.fcmToken, dto.platform ?? 'android');
        return this.issueTokens(user.id, user.email);
    }
    async refresh(refreshToken) {
        let payload;
        try {
            payload = await this.jwt.verifyAsync(refreshToken, { secret: this.cfg.get('JWT_REFRESH_SECRET') });
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const user = await this.users.findByIdWithRefresh(payload.sub);
        if (!user?.refreshTokenHash || !(await bcrypt.compare(refreshToken.split('.')[2], user.refreshTokenHash))) {
            if (user)
                await this.users.setRefreshHash(user.id, null);
            throw new common_1.UnauthorizedException('Refresh token revoked');
        }
        return this.issueTokens(user.id, user.email);
    }
    async logout(userId, fcmToken) {
        await this.users.setRefreshHash(userId, null);
        if (fcmToken)
            await this.users.removeDeviceToken(fcmToken);
    }
    async issueTokens(sub, email) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwt.signAsync({ sub, email }, { secret: this.cfg.get('JWT_ACCESS_SECRET'), expiresIn: this.cfg.get('JWT_ACCESS_TTL', '15m') }),
            this.jwt.signAsync({ sub, email }, { secret: this.cfg.get('JWT_REFRESH_SECRET'), expiresIn: this.cfg.get('JWT_REFRESH_TTL', '30d') }),
        ]);
        await this.users.setRefreshHash(sub, await bcrypt.hash(refreshToken.split('.')[2], 10));
        return { accessToken, refreshToken, user: { id: sub, email } };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService, jwt_1.JwtService, config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map