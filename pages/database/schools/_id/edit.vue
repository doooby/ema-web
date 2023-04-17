<template>
  <edit-page
    entity="schools"
    :fields="fields"
    @update="onUpdated"
  />
</template>

<script lang="ts">
import EditPage from '~/components/database/EditPage.vue';
import { Component } from 'vue-property-decorator';
import { FormFieldDefinition } from '~/components/Form';
import { Location, school } from '~/lib/records';
import { MaybeData } from '~/lib/types';
import { DatabasePage } from '~/components';

@Component({
  components: { EditPage },
})
export default class extends DatabasePage {
  get fields (): FormFieldDefinition[] {
    return school.recordControls({
      countryId: this.$store.getters['session/countryId'],
      addressOptions: this.addressOptions,
    });
  }

  get addressOptions () {
    const addressSystem = this.$store.state.session.countryData?.addressSystem;
    if (!addressSystem) return;
    return {
      system: addressSystem,
      fetchLocations: async (parent_id?: number): Promise<MaybeData<Location[]>> => {
        const system = addressSystem;
        if (!system) return { ok: false };
        const result = await this.$api.request(
          this.$api.queries.locations.index({
            location_system_id: system.id,
            parent: parent_id,
          }),
          this.$api.newQueryState(),
        );
        if (!result) return { ok: false };
        const records = result.records.filter(record => !('__invalid' in record)) as Location[];
        return { ok: true, data: records };
      },
    };
  }

  onUpdated (record: any) {
    this.$router.push({ path: `/database/schools/${record.id}` });
  }
}
</script>
