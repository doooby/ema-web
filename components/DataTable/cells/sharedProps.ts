import { PropType } from 'vue';
import { DataTable } from '..';

const sharedProps = {
  column: { type: Object as PropType<DataTable.Column>, required: true },
  dataItem: { type: Object as PropType<any>, required: true },
  template: { type: Function as PropType<any>, default: undefined },
};

export default sharedProps;
