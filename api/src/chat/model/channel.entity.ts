import { UserEntity } from "src/user/model/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { JoinedChannelEntity } from "./joined-channel.entity";
import { MessageEntity } from "./message.entity";
import { ChannelType } from "./channel.interface";

@Entity()
export class ChannelEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({nullable: true})
  description: string;

  @Column({type: 'enum', enum: ChannelType, default: ChannelType.PUBLIC})
  type: ChannelType;
  
  @Column({select: false, nullable: true})
  password: string;

  @ManyToMany(() => UserEntity)
  @JoinTable()
  users: UserEntity[];

  @ManyToMany(() => UserEntity)
  @JoinTable()
  admin: UserEntity[];

  @ManyToMany(() => UserEntity)
  @JoinTable()
  muted: UserEntity[];

  @ManyToMany(() => UserEntity)
  @JoinTable()
  ban: UserEntity[];
  
  @OneToMany(() => JoinedChannelEntity, joinedChannel => joinedChannel.channel, { onDelete: 'CASCADE' })
  joinedUsers: JoinedChannelEntity[];

  @OneToMany(() => MessageEntity, message => message.channel)
  messages: MessageEntity[];

  @ManyToOne(() => UserEntity, user => user.chatOwner)
  @JoinColumn()
  owner: UserEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

}