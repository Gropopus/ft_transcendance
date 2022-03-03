import { FriendEntity } from "src/app/friend/models/friend.entity";
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { FriendRequestEntity } from "../friends/friends.entity";
import { PlayerEntity } from "../history/history.entity";
import { UserRole, UserStatus } from "./user.interface";

@Entity()
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column({ unique: true })
    email: string;

    @Column()
    avatar: string;
    
    @Column()
    level: number;

    @OneToMany(() => FriendEntity, friend => friend.following)
    following: UserEntity[];

	@OneToMany(() => FriendEntity, friend => friend.followers)
    followers: UserEntity[];
    
    @Column({type: 'enum', enum: UserStatus, default: UserStatus.OFF})
    status: UserStatus;

    @Column({type: 'enum', enum: UserRole, default: UserRole.USER})
    role: UserRole;

	@Column()
	nbWin: number;
	
	@Column()
	nbLoss: number;
	
	@Column()
	twoFactorAuthEnabled: boolean;

	@Column({ nullable: true })
	twoFactorAuthenticationSecret: string;

	@OneToMany(
		() => FriendRequestEntity,
		(friendRequestEntity) => friendRequestEntity.creator,
	)
	sentFriendRequests: FriendRequestEntity[];

	@OneToMany(
	() => FriendRequestEntity,
	(friendRequestEntity) => friendRequestEntity.receiver,
	)
	receivedFriendRequests: FriendRequestEntity[];

	@OneToMany(
		() => PlayerEntity,
		(PlayerEntity) => PlayerEntity.playerOne,
	)
	host: FriendRequestEntity[];

	@OneToMany(
	() =>PlayerEntity,
	(PlayerEntity) => PlayerEntity.playerTwo,
	)
	opponentId: FriendRequestEntity[];
	
	@BeforeInsert()
	emailToLowerCase() {
		this.email = this.email.toLocaleLowerCase();
	}
}
