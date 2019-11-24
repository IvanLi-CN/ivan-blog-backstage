export interface TreeNodeInterface {
  id: number;
  level: number;
  expand: boolean;
  parent?: TreeNodeInterface;
  children?: TreeNodeInterface[];
}
