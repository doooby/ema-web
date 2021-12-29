<template>
  <edit-page
    entity="subjects"
    :fields="fields"
    @updated="onUpdated"
  />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import EditPage from '~/components/database/EditPage.vue';
import { DatabasePage } from '~/components';
import { FormFieldDefinition } from '~/components/Form';

@Component({
  components: { EditPage },
})
export default class extends DatabasePage {
  get fields (): FormFieldDefinition[] {
    return [
      [ 'country_id', 'hidden', { value: this.currentCountryId } ],
      [ 'name_en', 'text' ],
      [ 'name', 'text' ],
    ];
  }

  onUpdated () {
    this.$router.push({ path: '/database/subjects' });
  }
}
</script>
