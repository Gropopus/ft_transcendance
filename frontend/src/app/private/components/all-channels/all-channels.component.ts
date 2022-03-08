import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectionListChange } from '@angular/material/list';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { ChannelPaginateI, Ichannel, ChannelType } from 'src/app/model/chat/channel.interface';
import { UserI } from 'src/app/model/user/user.interface';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { ChatService } from '../../services/chat-service/chat.service';

@Component({
  selector: 'app-all-channels',
  templateUrl: './all-channels.component.html',
  styleUrls: ['./all-channels.component.css']
})
export class AllChannelsComponent implements OnInit, AfterViewInit{

  channels$: Observable<ChannelPaginateI> = this.chatService.getAllChannels();
  selectedChannel : Ichannel = null;
  InChannel : boolean = false;
  user: UserI = this.authService.getLoggedInUser();

  constructor(private chatService: ChatService,
	private authService: AuthService,
	public dialog: MatDialog
	) { }

  ngOnInit() {
    this.chatService.emitPaginateAllChannels(10, 0);
  }

  ngAfterViewInit() {
    this.chatService.emitPaginateAllChannels(10, 0);
  }

  addUserToChannel(event: MatSelectionListChange) {
	this.selectedChannel = event.source.selectedOptions.selected[0].value;
	this.chatService.findOne(this.selectedChannel.id).subscribe(channel => {
		this.selectedChannel = channel;		
		if (this.selectedChannel.users && this.selectedChannel.users.find(user => user.id === this.user.id)) {
			this.InChannel = true;
		}
		else {
			this.InChannel = false;
		}
	});
  }

  onPaginateChannels(pageEvent: PageEvent) {
    this.chatService.emitPaginateAllChannels(10, pageEvent.pageIndex);
  }

}
