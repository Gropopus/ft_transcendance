import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { switchMap, map, startWith, tap } from 'rxjs/operators';
import { MessagePaginateI } from 'src/app/model/chat/message.interface';
import { Ichannel, ChannelPaginateI, ChannelType } from 'src/app/model/chat/channel.interface';
import { UserI, UserPaginateI, UserRole } from 'src/app/model/user/user.interface';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { UserService } from 'src/app/public/services/user-service/user.service';
import { ChatService } from '../../services/chat-service/chat.service';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css']
})
export class AdministrationComponent implements OnInit, AfterViewInit {

	user: UserI = this.authService.getLoggedInUser();
	admin :UserRole = UserRole.ADMIN;
	allUsers$: Observable<UserPaginateI> = this.userService.getAllUsers();
	allChannels$: Observable<ChannelPaginateI> = this.chatService.getAllChannels();
	constructor(
		private authService: AuthService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private snackBar: MatSnackBar,
		private userService: UserService,
		private chatService: ChatService
  	) { }

	ngOnInit(): void {
		this.userService.findOne(this.user.id).subscribe(
			(user: UserI) => {
				this.user = user;
		// check if user status is owner or admin
		if (this.user.role !== UserRole.ADMIN && this.user.role !== UserRole.OWNER) {
			this.snackBar.open('You are not authorized to access this page', '', {
				duration: 3000,
				panelClass: ['red-snackbar','login-snackbar'],
			});
			this.router.navigate(['../setting'], { relativeTo: this.activatedRoute });
		}
		else {
			// remove current user from all users list
			this.allUsers$ = this.allUsers$.pipe(
			map(users => {
				return {
					...users,
					items: users.items.filter(user => user.id !== this.user.id)
				};
			})
			);
			this.chatService.emitPaginateAllChannels(10, 0);
		}
	});
	}

	ngAfterViewInit() {
		this.chatService.emitPaginateAllChannels(10, 0);
	}

	onPaginateChannels(pageEvent: PageEvent) {
		this.chatService.emitPaginateAllChannels(10, pageEvent.pageIndex);
	  }

	// delete a channel by id
	deleteChannel(channelId: number) {
		this.chatService.deleteChannel(channelId).subscribe(
			data => {
				this.snackBar.open('Channel deleted', '', {
					duration: 3000,
				});
				this.chatService.emitPaginateAllChannels(10, 0);
			},
		);
	}

	// ban user by id
	banUser(user : UserI) {
		if (user.role != UserRole.OWNER) {
			user.ban = !user.ban;
		}
		this.userService.banUser(user).subscribe();
	}

	changeRole(user : UserI) {
		if (user.role != UserRole.OWNER) {
			if (user.role === UserRole.ADMIN) {
				user.role = UserRole.USER;
			}
			else {
				user.role = UserRole.ADMIN;
			}
		}
		this.userService.changeRole(user).subscribe();
	}

	optionChannel(channelId: number) {
	  this.router.navigate(['../option-channel/' + channelId], { relativeTo: this.activatedRoute });
	}

}
