<template>
  <new2-page
    entity="material_kits"
    :fields="fields"
  />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { FormFieldDefinition } from '~/components/Form';
import New2Page from '~/components/database/pages/new/New2Page.vue';
import { material_kit } from '~/lib/records';

@Component({
  components: { New2Page },
})
export default class extends DatabasePage {
  get fields (): FormFieldDefinition[] {
    return [
      [ 'country_id', 'hidden', { value: this.$store.getters['session/countryId'] } ],
      ...material_kit.controls.all(),
    ];
  }
}
</script>
