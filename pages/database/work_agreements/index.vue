<template>
  <index4-page
    entity="work_agreements"
    :search-fields="searchFields"
    :actions="actions"
  />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { controls } from '~/components/Form';
import Index4Page from '~/components/database/pages/index/index4Page.vue';
import app from '~/lib/app';

@Component({
  components: { Index4Page },
})
export default class extends DatabasePage {
  get searchFields () {
    return [
      [ 'search', controls.text ],
      [ 'position', controls.select, {
        options: app.extendOptionsList(
          this.$store.getters['session/countryStaticData']?.options.contract_position(),
        ),
      } ],
    ];
  }

  actions = [
    { action: 'edit', icon: 'pencil', t: 'db.page.edit.action' },
  ];
}
</script>
