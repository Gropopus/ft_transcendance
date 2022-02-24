import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Ichannel, ChannelType } from 'src/app/model/chat/channel.interface';
import { UserI, UserRole } from 'src/app/model/user/user.interface';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { UserService } from 'src/app/public/services/user-service/user.service';
import { ChatService } from '../../services/chat-service/chat.service';

@Component({
  selector: 'app-option-channel',
  templateUrl: './option-channel.component.html',
  styleUrls: ['./option-channel.component.css']
})
export class OptionChannelComponent implements OnInit {
	
  user: UserI = this.authService.getLoggedInUser();
  IsOwner: boolean = false;
  channel: Ichannel = {};
  radiocheck: boolean = true;
  beforeType: string = 'public';
  form: FormGroup = new FormGroup({
	id : new FormControl(''),
	password: new FormControl({value: '', disabled: true}),
	owner : new FormControl(''),
	type: new FormControl(null ,[Validators.required]),
  });

  private channelId$: Observable<number> = this.activatedRoute.params.pipe(
	map((params: Params) => parseInt(params['id']))
  )

  channel$: Observable<Ichannel> = this.channelId$.pipe(
	switchMap((channelId: number) => this.chatService.findOne(channelId))
	)

  constructor(
	  private chatService: ChatService,
	  private authService: AuthService,
	  private router: Router,
	  private activatedRoute: ActivatedRoute,
	  private _snackBar: MatSnackBar,
	  private userService: UserService,
	  	) { 
			this.activatedRoute.params.subscribe(params => {
				if (params["id"]) {
				  this.doSearch(params["id"]);
				}
			  });
			}

	ngOnInit(): void {
		this.userService.findOne(this.user.id).subscribe(user => {
			this.user = user;
			// check if user status is owner or admin
			this.channel$.subscribe(val => {
				let authorized : boolean = false;

				if (!val) this.router.navigate(['../../page-not-found'],{ relativeTo: this.activatedRoute })
				if (this.user.role == UserRole.USER) {
					if (val.owner.id === this.user.id) {
						authorized = true;
						this.IsOwner = true;
					}
					if (val.admin.find(admin => admin.id === this.user.id)) {
						authorized = true;
					}
				}
				else {
					authorized = true;
				}
				if (!authorized) {
					this._snackBar.open('You are not authorized to access this page', '', {
						duration: 2000,
						panelClass: ['red-snackbar','login-snackbar'],
					});
					this.router.navigate(['../../dashboard'], { relativeTo: this.activatedRoute });
				}
				else {
					this.channel = val;
					this.channel$ = this.channel$.pipe(
						map(channel => {
							return {
								...channel,
								users: channel.users.filter(user => user.id !== this.user.id)
							};
						})
						);
						this.form.patchValue({
							id: this.channel.id,
							owner: this.channel.owner,
						});
						// remove current user from all users list
				}
			});
		});
	}

	doSearch(term: string) {		
		let test = parseInt(term);
		if (isNaN(test)) {
		  this.router.navigate(['../../page-not-found'],{ relativeTo: this.activatedRoute })
		}
	}

	modify() {
		if (this.form.valid) {
			this.chatService.changeType(this.form.getRawValue(), this.form.get('type').value, this.form.get('password').value, this.user);
		  } 
	}
	
	radioType($event: MatRadioChange) {
		if ($event.value == 'public') {
			this.form.get('password').clearValidators();
        	this.form.get('password').disable();
			this.form.get('password').setValue('');
			this.form.get('type').setValue('public');
			this.beforeType = 'public';
		}
		else if ($event.value == 'private') {
			this.form.get('password').clearValidators();
        	this.form.get('password').disable();
			this.form.get('password').setValue('');
			this.form.get('type').setValue('private');
			this.beforeType = 'private';
		}
		else {
			this.form.get('password').setValidators([Validators.required]);
			this.form.get('password').enable();
			this.form.get('type').setValue('protected');
			this.beforeType = 'protected';
		}
	  }

	isAdmin(user: UserI) {
		return this.channel.admin && this.channel.admin.find(admin => admin.id === user.id);
	}

	isMuted(user: UserI) {
		return this.channel.muted && this.channel.muted.find(muted => muted.id === user.id);
	}

	addAdmin(user: UserI) {
		this.chatService.addAdmin(this.channel, user);
		this.channel.admin.push(user);
	}

	addMuted(user: UserI) {
		// check if user is owner channel
		if (user.id === this.channel.owner.id) {
			this._snackBar.open('You can\'t mute owner channel', '', {
				duration: 2000,
				panelClass: ['red-snackbar','login-snackbar'],
			});
		}
		else {
			this.chatService.addMuted(this.channel, user);
			this.channel.muted.push(user);
		}
	}

	removeUser(user: UserI) {
		this.removeAdmin(user);
		this.removeMuted(user);
		this.chatService.removeUser(this.channel, user);
		this.router.navigate(['../../dashboard'], { relativeTo: this.activatedRoute });
	}

	removeAdmin(user: UserI) {
		if (user.id === this.channel.owner.id) {
			this._snackBar.open('He\'s owner channel', '', {
				duration: 2000,
				panelClass: ['red-snackbar','login-snackbar'],
			});
		}
		else {
			this.chatService.removeAdmin(this.channel, user);
			this.channel.admin = this.channel.admin.filter(admin => admin.id !== user.id);
		}
	}

	removeMuted(user: UserI) {
		this.chatService.removeMuted(this.channel, user);
		this.channel.muted = this.channel.muted.filter(muted => muted.id !== user.id);
	}

	changePassword(password: string) {
		this.chatService.changePassword(this.channel, password);
	}

	changeType(type: ChannelType, password: string) {
		this.chatService.changeType(this.channel, type, password, this.user);
	}
}
