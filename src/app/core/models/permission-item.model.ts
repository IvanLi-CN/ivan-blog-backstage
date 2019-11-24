export class PermissionItem {
  title: string;
  path?: string;
  children?: PermissionItem[];
  icon?: string;
  id: string;
  parent?: PermissionItem;
  isHidden?: boolean;
  newCount?: number;
  data?: object;
}
