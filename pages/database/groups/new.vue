<template>
  <new-page
    entity="groups"
    :fields="fields"
    @created="onCreated"
  />
</template>

<script lang="ts">
import NewPage from '~/components/database/NewPage.vue';
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { FormFieldDefinition } from '~/components/Form';
import { group } from '~/lib/records';

@Component({
  components: { NewPage },
})
export default class extends DatabasePage {
  get fields (): FormFieldDefinition[] {
    return group.recordControls({ countryId: this.currentCountryId });
  }

  onCreated (recordId: Number) {
    this.$router.push({ path: `/database/groups/${recordId}` });
  }
}

</script>
