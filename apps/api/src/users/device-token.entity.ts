import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('device_tokens')
export class DeviceToken {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Index({ unique: true }) @Column() token: string;
  @Column({ default: 'android' }) platform: 'ios' | 'android';
  @Column({ name: 'user_id' }) userId: string;
  @ManyToOne(() => User, (u) => u.deviceTokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) user: User;
  @UpdateDateColumn({ name: 'last_seen_at' }) lastSeenAt: Date;
}
