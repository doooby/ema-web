<template>
  <new-page
    :prefetching="prefetching"
    entity="courses"
    :values="values"
    :fields="fields"
    @created="onCreated"
  />
</template>

<script lang="ts">
import NewPage from '~/components/database/NewPage.vue';
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { FormFieldDefinition } from '~/components/Form';
import { course } from '~/lib/records';

@Component({
  components: { NewPage },
})
export default class extends DatabasePage {
  prefetching = true;

  values = {};

  async mounted () {
    if (this.$route.params.school_id) {
      const result = await this.$api.request(
        this.$api.queries.schools.searchAssociated({
          country_id: this.$store.getters['session/countryId'],
          id: this.$route.params.school_id,
          per_page: 1,
        }),
        this.$api.newQueryState(),
      );
      if (result?.records?.[0]) {
        this.values = { ...this.values, school: result.records[0] };
      }
    }

    this.prefetching = false;
  }

  get fields (): FormFieldDefinition[] {
    return course.recordControls({ countryId: this.currentCountryId });
  }

  onCreated (recordId: Number) {
    this.$router.push({ path: `/database/courses/${recordId}` });
  }
}
</script>
