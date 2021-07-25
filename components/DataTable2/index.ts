import View from './View.vue';

export namespace DataTable {
  export interface Column {
    name: string;
    getText?: (item: any) => undefined | string;
    slot?: string;
    cell?: any
    data?: any;
  }
}

export {
  View as DataTableView,
};
