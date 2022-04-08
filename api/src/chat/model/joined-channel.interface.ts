import { Iuser } from "src/user/model/user.interface";
import { Ichannel } from "./channel.interface";


export interface IjoinedChanel {
  id?: number;
  Iuserid: number;
  socketId: string;
  user: Iuser;
  channel: Ichannel;
  channelId: number;
}