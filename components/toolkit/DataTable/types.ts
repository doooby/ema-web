import { Vue } from 'vue-property-decorator';

export interface DataTableColumn {
  name: string;
  size?: number;
  fixedSize?: boolean;
  header?: (column: DataTableColumn) => Vue.VNode;
  headerText?: string;
}
