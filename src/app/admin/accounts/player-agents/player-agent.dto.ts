import {Moment} from 'moment';

export class PlayerAgentDto {
  'id': number;
  'parentId': number;
  'username': string;
  'nick': string;
  'isActive': boolean;
  'sumPlayerCount': number;
  'validPlayerCount': number;
  'todayPlayerCount': {
    count: number,
    date: string | Date | Moment,
  }[];
  totalPlayerCount?: number;
  totalValidPlayerCount?: number;
  children: PlayerAgentDto[];
}
