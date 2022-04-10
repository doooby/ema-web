import View from './View.vue';

export namespace DataTable {
  export interface Column {
    name: string;
    headerText?: false | (() => string);
    getText?: (item: any) => undefined | string;
    size?: number;
    slot?: string;
    cell?: any
    data?: any;
  }
}

export {
  View as DataTableView,
};
