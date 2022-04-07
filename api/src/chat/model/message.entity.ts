import { UserEntity } from "src/user/model/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ChannelEntity } from "./channel.entity";

@Entity()
export class MessageEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column({nullable: true})
  type: number;

  @Column({nullable: true})
  challengeId: number;

  @ManyToOne(() => UserEntity, user => user.messages)
  @JoinColumn()
  user: UserEntity;

  @Column()
  username: string;

  @ManyToOne(() => ChannelEntity, channel => channel.messages, { onDelete: 'CASCADE' })
  @JoinTable()
  channel: ChannelEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
  
}