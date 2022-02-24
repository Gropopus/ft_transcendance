import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { switchMap, map, startWith, tap } from 'rxjs/operators';
import { MessagePaginateI } from 'src/app/model/chat/message.interface';
import { Ichannel, ChannelPaginateI, ChannelType } from 'src/app/model/chat/channel.interface';
import { UserI } from 'src/app/model/user/user.interface';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { ChatService } from '../../services/chat-service/chat.service';

@Component({
  selector: 'app-add-user-channel',
  templateUrl: './add-user-channel.component.html',
  styleUrls: ['./add-user-channel.component.css']
})
export class AddUserChannelComponent implements OnChanges {

  @Input() joinChannel: Ichannel;
  @Input() InChannel: boolean;
  user: UserI = this.authService.getLoggedInUser();
  protected = ChannelType.PROTECTED;

  password: FormControl = new FormControl({value: '', disabled: false}, [Validators.required]);



  constructor(
	  private chatService: ChatService,
	  private authService: AuthService,
	  private router: Router,
	  private activatedRoute: ActivatedRoute,
	  private snackBar: MatSnackBar
	  	) { }

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.InChannel) {
			this.InChannel = changes.InChannel.currentValue;
		}
	}

	addUser() {
		if (this.InChannel) {
			return;
		}
		if (this.password.value === undefined) {
			this.password.setValue('');
		}
		
		this.chatService.addUserToChannel(this.joinChannel, this.password.value);
		setTimeout(() => {
			if (this.joinChannel.type === this.protected) {
				this.chatService.IsInChannel(this.joinChannel.id, this.user.id).subscribe();
			}
			else {
				this.router.navigate(['../dashboard'], {relativeTo: this.activatedRoute});
				this.snackBar.open(`You're in the channel !`, 'Close', {
					duration: 3000, horizontalPosition: 'right', verticalPosition: 'top',
				});
				
			}
		}, 500);
  }
}
