import { Iuser } from "src/user/model/user.interface";

export enum ChannelType {
    PUBLIC = 'public',
    PRIVATE = 'private',
    PROTECTED = 'protected',
    CLOSE = 'close',
    DIRECT = 'direct-message'
}

export interface Ichannel {
  id?: number;
  name?: string;
  description?: string;
  password?: string;
  type?: ChannelType;
  users?: Iuser[];
  admin?: Iuser[];
  muted?: Iuser[];
  ban?:   Iuser[];
  owner?: Iuser;
  created_at?: Date;
  updated_at?: Date;
}
