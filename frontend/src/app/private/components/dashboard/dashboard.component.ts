import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ChannelPaginateI } from 'src/app/model/chat/channel.interface';
import { UserI } from 'src/app/model/user/user.interface';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { ChatService } from '../../services/chat-service/chat.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit{

  channels$: Observable<ChannelPaginateI> = this.chatService.getMyChannels();
  selectedChannel = null;
  user: UserI = this.authService.getLoggedInUser();

  constructor(private chatService: ChatService, private authService: AuthService) { }

  ngOnInit() {
    this.chatService.emitPaginateChannels(10, 0);
  }

  ngAfterViewInit() {
    this.chatService.emitPaginateChannels(10, 0);
  }

  onSelectChannel(event: MatSelectionListChange) {
    this.selectedChannel = event.source.selectedOptions.selected[0].value;
  }

  onPaginateChannels(pageEvent: PageEvent) {
    this.chatService.emitPaginateChannels(pageEvent.pageSize, pageEvent.pageIndex);
  }

}
