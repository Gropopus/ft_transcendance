import { Meta } from "./meta.interface";
import { UserI } from "../user/user.interface";

export enum ChannelType {
    PUBLIC = 'public',
    PRIVATE = 'private',
    PROTECTED = 'protected',
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

export interface ChannelPaginateI {
  items: Ichannel[];
  meta: Meta;
}