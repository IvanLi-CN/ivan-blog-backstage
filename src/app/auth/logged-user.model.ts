import { UserTypes } from '../core/enums/user-types.enum';

export class LoggedUser {
  id: number;
  type: UserTypes;
  nick: string;
  username: string;
  roleId: number;
  balance: number;
  count: number;
  isWorking?: boolean;
  bizInfo?: string;
  isBindGoogleValidator?:boolean;
}
