import { Vue } from 'vue-property-decorator';

export interface Column {
  name: string;
  size: number;
  fixedSize?: boolean;
  renderHeader?: (column: Column) => Vue.VNode;
  renderCell?: (record) => Vue.VNode;
  data?: unknown;
}
