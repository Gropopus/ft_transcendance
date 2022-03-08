import { Iuser } from "../user/user.interface";

export enum ChannelType {
    PUBLIC = 'public',
    PRIVATE = 'private',
    PROTECTED = 'protected',
    CLOSE = 'close',
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
  owner?: Iuser;
  created_at?: Date;
  updated_at?: Date;
}
