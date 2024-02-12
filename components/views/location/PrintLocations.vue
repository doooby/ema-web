<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import app from '~/lib/app';
import { location, location_system } from '~/lib/records';
import { wai } from '~/vendor/wai';
import TextNames from '~/components/database/components/TextNames.vue';

@Component({
  components: { TextNames },
})
export default class PrintLocations extends Vue {
  @Prop({ required: true }) readonly system!: app.Maybe<location_system.V3_LocationSystem>;
  @Prop() readonly value?: string[];

  locations: app.Map<location.Location> = {};

  created () {
    this.onStateChange();
  }

  get state () {
    const levels = location_system.unnestLevelsSettings(this.system);
    const locations_ids = levels
      .map(
        (level, index) => level.type === 'l' ? this.value?.[index] : undefined,
      )
      .filter(a => a) as string[];
    return {
      levels, locations_ids,
    };
  }

  @Watch('state')
  async onStateChange () {
    this.locations = {};
    if (!this.state.levels.length || !this.state.locations_ids.length) return;

    const { okPayload } = await this.$api2.V3_request({
      path: '/locations',
      params: {
        id: this.state.locations_ids,
        per_page: 50,
        location_system_id: this.system?.id,
      },
      reducer: value => wai.recordsList(value, location.parseRecord),
    });

    if (okPayload) {
      this.locations = {};
      for (const record of okPayload.records) {
        this.locations[record.id ?? '-1'] = record;
      }
    }
  }
}
</script>

<template>
  <div :class="$attrs.class">
    <div v-if="!system" class="alert alert-info">
      <t value="controls.LocationInput.missing_location_system" />
    </div>
    <div
      v-for="(level, index) of state.levels"
      v-else
      :key="index"
      :class="{ 'mt-1': index > 0 }"
    >
      <div v-if="value?.[index]">
        <TextNames
          class="font-14 mb-1"
          :value="level.name"
          :inline="true"
        />
        <TextNames
          v-if="level.type === 'l'"
          :value="locations[value?.[index]]?.name"
          :inline="true"
        />
        <span v-else>{{ value?.[index] }}</span>
      </div>
    </div>
  </div>
</template>
