import Vue from 'vue';
import { IconsPlugin } from 'bootstrap-vue';

import DataTableView from '~/components/DataTable/View.vue';
import FormView from '~/components/Form/View.vue';
import FormGroup from '~/components/Form/Group.vue';
import FormField from '~/components/Form/Field';

import * as global_utils from '~/lib/global_utils';

Vue.use(IconsPlugin);

Vue.component('DataTableView', DataTableView);
Vue.component('FormView', FormView);
Vue.component('FormGroup', FormGroup);
Vue.component('FormField', FormField);

declare global {
  const utils: typeof global_utils;
}
// @ts-ignore
globalThis.utils = global_utils;
