import { UserI } from "src/user/model/user.interface";
import { Ichannel } from "./channel.interface";


export interface MessageI {
  id?: number;
  type: number;
  text: string;
  user: UserI;
  channel: Ichannel;
  created_at: Date;
  updated_at: Date;
}