export type Cell =
  { type: 'assoc', entity: string, text?(item: any): string }
  | { type: 'link', entity: string, text?(item: any): string }
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
}
