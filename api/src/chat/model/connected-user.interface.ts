import { Iuser } from "src/user/model/user.interface";


export interface ConnectedIuser {
  id?: number;
  socketId: string;
  user: Iuser;
}