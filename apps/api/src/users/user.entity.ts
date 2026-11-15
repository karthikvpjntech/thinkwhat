import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DeviceToken } from './device-token.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) email: string;
  @Column({ name: 'password_hash', select: false }) passwordHash: string;
  @Column({ nullable: true }) name?: string;
  @Column({ name: 'refresh_token_hash', nullable: true, select: false }) refreshTokenHash?: string | null;
  @OneToMany(() => DeviceToken, (d) => d.user) deviceTokens: DeviceToken[];
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
}
