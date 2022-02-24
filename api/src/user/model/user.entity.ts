import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ConnectedUserEntity } from "src/chat/model/connected-user.entity";
import { JoinedChannelEntity } from "src/chat/model/joined-channel.entity";
import { MessageEntity } from "src/chat/model/message.entity";
import { ChannelEntity } from "src/chat/model/channel.entity";
import { RelationshipEntity } from "src/relationship/relationship.entity";
import { Exclude } from 'class-transformer';
import { UserRole, UserStatus } from "./user.interface";

@Entity()
export class UserEntity {
	
	@PrimaryGeneratedColumn()
	id: number;
	
	@Column({unique: true})
	username: string;
	
	@Column({unique: true})
	email: string;

	@Column({default: false})
	ban: boolean;
	
	@Column({select: false})
	password: string;
	
	@Column({default: 'user.png'})
	avatar: string;
	
	@Column({default: 0})
	level: number;
	
	@Column({ nullable: true })
	nbWin: number;
	
	@Column({ unique: true, nullable: true })
	school42id: number;

	@Column({ nullable: true })
	nbLoss: number;
	
	@Column({ default: false })
	twoFactorAuthEnabled: boolean;

	@Column({ nullable: true })
	twoFactorAuthenticationSecret: string;

	@Column({type: 'enum', enum: UserStatus, default: UserStatus.OFF})
	status: UserStatus;

	@Column({type: 'enum', enum: UserRole, default: UserRole.USER})
	role: UserRole;

	@ManyToMany(() => ChannelEntity, channel => channel.users)
	channels: ChannelEntity[]

	@ManyToMany(() => ChannelEntity, channel => channel.admin)
 	admin: ChannelEntity[]

 	@OneToMany(() => ConnectedUserEntity, connection => connection.user)
 	connections: ConnectedUserEntity[];

 	@OneToMany(() => JoinedChannelEntity, joinedChannel => joinedChannel.channel)
 	joinedChannels: JoinedChannelEntity[];

 	@OneToMany(() => MessageEntity, message => message.user)
 	messages: MessageEntity[];

	@OneToMany(() => ChannelEntity, channel => channel.owner)
	chatOwner: ChannelEntity[];

	@OneToMany(() => RelationshipEntity, relationship => relationship.userId1)
	relationships: RelationshipEntity[];

	@OneToMany(() => RelationshipEntity, relationship => relationship.userId2)
	relationships1: RelationshipEntity[];

 	@BeforeInsert()
 	@BeforeUpdate()
 	emailToLowerCase() {
    	this.email = this.email.toLowerCase();
    	//this.username = this.username.toLowerCase();
  }

}