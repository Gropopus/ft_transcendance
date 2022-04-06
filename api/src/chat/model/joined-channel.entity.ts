import { UserEntity } from "src/user/model/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ChannelEntity } from "./channel.entity";

@Entity()
export class JoinedChannelEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  socketId: string;

  @ManyToOne(() => UserEntity, user => user.joinedChannels)
  @JoinColumn()
  user: UserEntity;

  @Column()
  Iuserid: number;

  @ManyToOne(() => ChannelEntity, channel => channel.joinedUsers, { onDelete: 'CASCADE' })
  @JoinColumn()
  channel: ChannelEntity;

  @Column()
  channelId: number;
}