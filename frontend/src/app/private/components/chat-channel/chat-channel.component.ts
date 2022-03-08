import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { switchMap, map, startWith, tap } from 'rxjs/operators';
import { MessagePaginateI } from 'src/app/model/chat/message.interface';
import { Ichannel } from 'src/app/model/chat/channel.interface';
import { UserI, UserRole } from 'src/app/model/user/user.interface';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { UserService } from 'src/app/public/services/user-service/user.service';
import { ChatService } from '../../services/chat-service/chat.service';

@Component({
  selector: 'app-chat-channel',
  templateUrl: './chat-channel.component.html',
  styleUrls: ['./chat-channel.component.css']
})
export class ChatChannelComponent implements OnChanges, OnDestroy, AfterViewInit {

  @Input() chatChannel: Ichannel;
  @ViewChild('messages') private messagesScroller: ElementRef;
  user: UserI = this.authService.getLoggedInUser();
  IsOwner: boolean = false;
  IsAdmin: boolean = false;
  messagesPaginate$: Observable<MessagePaginateI> = combineLatest([this.chatService.getMessages(), this.chatService.getAddedMessage().pipe(startWith(null))]).pipe(
    map(([messagePaginate, message]) => {
		if (message && message.channel.id === this.chatChannel.id && !messagePaginate.items.some(m => m.id === message.id)) {
			messagePaginate.items.push(message);
		}
		const items = messagePaginate.items.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
		messagePaginate.items = items;
		this.userService.findOne(this.user.id).subscribe(user => {
			this.user = user;
		if (this.chatChannel.owner && this.chatChannel.owner.id === this.user.id)
			  this.IsOwner = true;
		else this.IsOwner = false;

		if (this.chatChannel.admin && this.chatChannel.admin.some(m => m.id === this.user.id) ||
		this.user.role === UserRole.ADMIN || this.user.role === UserRole.OWNER){
			  this.IsAdmin = true;
			}
		else this.IsAdmin = false;
		});
		if (this.chatChannel.muted && this.chatChannel.muted.some(m => m.id === this.user.id)){
			  this.chatMessage.disable();
			  this.chatMessage.setValue('You are muted');
			}
		else {
			this.chatMessage.enable();
			this.chatMessage.setValue('');
		}
		return messagePaginate;
    }),
    tap(() => this.scrollToBottom())
	)

  chatMessage: FormControl = new FormControl({value: '', disabled: false}, [Validators.required]);

  constructor(
	  private chatService: ChatService,
	  private authService: AuthService,
	  private router: Router,
	  private activatedRoute: ActivatedRoute,
	  private _snackBar: MatSnackBar,
	  private userService: UserService
	  	) {
        chatService.socket.on('startGame', function(data: {channel: Ichannel, u_id: number, type: number, m_id: number}) {
          chatService.newPrivateGame(data.channel, data.u_id, data.type, data.m_id);
          router.navigate(['../../private/match/']);
        });
      }

  ngOnChanges(changes: SimpleChanges) {
    this.chatService.leaveJoinChannel(changes['chatChannel'].previousValue);
    if (this.chatChannel) {
      this.chatService.joinChannel(this.chatChannel);
    }
  }

  ngAfterViewInit() {
    if (this.messagesScroller) {
      this.scrollToBottom();
    }
  }

  ngOnDestroy() {
    this.chatService.leaveJoinChannel(this.chatChannel);
  }

  sendMessage() {
    if (this.chatMessage.valid) {
    this.chatService.sendMessage({ text: this.chatMessage.value, type: 0, channel: this.chatChannel });
    this.chatMessage.reset();
    }
  }

  gameInvite(type: number) {
    if (type == 0)
      this.chatService.inviteMessage({ text: 'NORMAL GAME INVITE', type: 1, channel: this.chatChannel }, this.user.id, type);
    else
      this.chatService.inviteMessage({ text: 'BLITZ GAME INVITE', type: 1, channel: this.chatChannel }, this.user.id, type);
    this.chatMessage.reset();
  }

  joinGameChannel(id: number) {
    this.chatService.newPrivatePlayer(this.chatChannel, this.user.id, id);
    this.router.navigate(['../match/'], { relativeTo: this.activatedRoute });
  }

  scrollToBottom(): void {
    try {
      setTimeout(() => { this.messagesScroller.nativeElement.scrollTop = this.messagesScroller.nativeElement.scrollHeight }, 1);
    } catch { }

  }

  LeaveChatChannel(action : string) {
	this.chatService.leaveChannel(this.chatChannel);
	this._snackBar.open('You ' +  action + ' ' + this.chatChannel.name + ' !', 'Close', {
		duration: 2000,
	});
	this.router.navigate(['../profile'], { relativeTo: this.activatedRoute });
  }

  optionChannel(channelId: number) {
	this.router.navigate(['../option-channel/' + channelId], { relativeTo: this.activatedRoute });
  }
}
