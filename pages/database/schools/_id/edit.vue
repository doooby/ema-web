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
import { DatabasePage } from '~/components';
import { FormFieldDefinition } from '~/components/Form';
import { Location, LocationSystem, school } from '~/lib/records';
import { MaybeData } from '~/lib/types';

@Component({
  components: { EditPage },
})
export default class extends DatabasePage {
  processing = true;
  addressSystem: undefined | LocationSystem = undefined;

  async mounted () {
    const result = await this.$api.request(
      this.$api.queries.location_systems.getAddressSystem({
        country_id: this.currentCountryId,
      }),
      this.$api.newQueryState(),
    );
    const record = result?.records?.[0];
    if (record && !('__invalid' in record)) {
      this.addressSystem = record;
    }

    this.processing = false;
  }

  get fields (): FormFieldDefinition[] {
    if (this.processing) return [];

    return school.recordControls(this.addressOptions);
  }

  get addressOptions () {
    if (!this.addressSystem) return;
    return {
      system: this.addressSystem,
      fetchLocations: async (parent_id?: number): Promise<MaybeData<Location[]>> => {
        const system = this.addressSystem;
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
