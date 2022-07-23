import View from './View.vue';

export namespace ItemsListing {
  export interface Column {
    name: string;
    size?: number;
  }

  export interface ComputedColumn {
    key: number;
    style: string;
    headerSlot: string;
    cellSlot: string;
  }
}

export {
  View as ItemsListingView,
};
