export interface AssociatedRecordCellType {
  type: 'assoc';
  entity: string;
}

export interface RecordLinkCellType {
  type: 'link';
  entity: string;
  text?(item: any): string;
}

export type Cell =
  AssociatedRecordCellType
  | RecordLinkCellType
  ;

export interface TableRow {
  index: number;
  item: any;
}

export interface TableColumn {
  name: string;
  getText?: (item: any) => undefined | string;
  slot?: string;
  cell?: Cell
  data?: any;
}
