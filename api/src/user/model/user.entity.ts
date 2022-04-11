import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ConnectedUserEntity } from "src/chat/model/connected-user.entity";
import { JoinedChannelEntity } from "src/chat/model/joined-channel.entity";
import { MessageEntity } from "src/chat/model/message.entity";
import { ChannelEntity } from "src/chat/model/channel.entity";
import { FriendEntity } from "src/friend/friend.entity";
import { UserStatus } from "./user.interface";
import { PlayerEntity } from "src/player/player.entity";

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
	
	@Column({default: 'profile-picture.png'})
	picture: string;
	
	@Column({default: 1000})
	level: number;
	
	@Column({ nullable: true })
	victory: number;
	
	@Column({ unique: true, nullable: true })
	id42: number;

	@Column({ nullable: true })
	defeat: number;
	
	@Column({ default: false })
	twoFactorAuthEnabled: boolean;
	
	@Column({ nullable: true })
	twoFactorAuthenticationSecret: string;
	
	@Column({type: 'enum', enum: UserStatus, default: UserStatus.OFF})
	status: UserStatus;

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
	 
	 @OneToMany(() => FriendEntity, friends => friends.user, {
		cascade: true,
	})
	friends: FriendEntity[];
	
	@OneToMany(() => FriendEntity, friends => friends.target, {
		cascade: true,
	})
	target: FriendEntity[];

    @OneToMany(() => PlayerEntity, player => player.user)
	history: PlayerEntity[];

	
	@BeforeInsert()
 	@BeforeUpdate()
 	emailToLowerCase() {
    	this.email = this.email.toLowerCase();
	}

	@Column({ default: 0, nullable: true })
	lastTask: number;

}