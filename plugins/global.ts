import Vue from 'vue';
import { IconsPlugin } from 'bootstrap-vue';

import DataTableView from '~/components/DataTable/View.vue';
import { ItemsListingMain } from '~/components/ItemsListing';
import { FormGroup } from '~/components/Form';
import FormField from '~/components/Form/Field';
import Translation from '~/components/toolkit/Translation.vue';
import BtnMini from '~/components/toolkit/BtnMini.vue';

import * as global_utils from '~/lib/global_utils';

Vue.use(IconsPlugin);

Vue.component('DataTableView', DataTableView);
Vue.component('ItemsListing', ItemsListingMain);
Vue.component('FormGroup', FormGroup);
Vue.component('FormField', FormField);
Vue.component('T', Translation);
Vue.component('BtnMini', BtnMini);

declare global {
  const utils: typeof global_utils;
}
// @ts-ignore
globalThis.utils = global_utils;
