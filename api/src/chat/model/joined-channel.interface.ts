import { UserI } from "src/user/model/user.interface";
import { Ichannel } from "./channel.interface";


export interface JoinedChannelI {
  id?: number;
  socketId: string;
  user: UserI;
  userId: number;
  channel: Ichannel;
}