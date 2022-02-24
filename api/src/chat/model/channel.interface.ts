import { UserI } from "src/user/model/user.interface";

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
  users?: UserI[];
  admin?: UserI[];
  muted?: UserI[];
  owner?: UserI;
  created_at?: Date;
  updated_at?: Date;
}
