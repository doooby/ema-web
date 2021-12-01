import Vue from 'vue';
import { IconsPlugin } from 'bootstrap-vue';

import DataTableView from '~/components/DataTable/View.vue';
import { FormGroup } from '~/components/Form';
import FormField from '~/components/Form/Field';
import Translation from '~/components/Translation.vue';

import * as global_utils from '~/lib/global_utils';

Vue.use(IconsPlugin);

Vue.component('DataTableView', DataTableView);
Vue.component('FormGroup', FormGroup);
Vue.component('FormField', FormField);
Vue.component('T', Translation);

declare global {
  const utils: typeof global_utils;
}
// @ts-ignore
globalThis.utils = global_utils;
