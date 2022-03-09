import { Iuser } from "src/user/model/user.interface";
import { Ichannel } from "./channel.interface";


export interface Imessage {
  id?: number;
  type: number;
  user: Iuser;
  text: string;
  channel: Ichannel;
  created_at: Date;
  updated_at: Date;
}