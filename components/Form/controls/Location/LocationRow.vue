<template>
  <div>
    <small class="emb-2">
      {{ level.name[1] }} ({{ level.name[0] }})
    </small>
    <br>
    <select-with-modal
      v-if="level.type === 'l'"
      :value="value"
      :disabled="disabled"
      :options-source="optionSource"
      @select="$emit('change', $event)"
    >
      <template #modal-title>
        {{ level.name[1] }} ({{ level.name[0] }})
      </template>
    </select-with-modal>
    <div v-if="level.type === 't'">
      <text-input
        :value="value"
        :disabled="disabled"
        @input="$emit('change', $event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { location, location_system } from '~/lib/records';
import SelectWithModal, { OptionsSource } from '~/components/Form/primitives/SelectWithModal.vue';
import { Option } from '~/lib/types';
import TextInput from '~/components/Form/primitives/TextInput.vue';
import { wai } from '~/vendor/wai';
import app from '~/lib/app';

@Component({
  components: { SelectWithModal, TextInput },
})
export default class LocationRow extends Vue {
  @Prop({ required: true }) level!: location_system.LocationSystemLevel;
  @Prop({ required: true }) parentValue!: undefined | string;
  @Prop({ required: true }) value!: undefined | string;
  @Prop({ required: true }) disabled!: boolean;
  @Prop({ required: true }) fetchLocations!: () => Promise<
    app.Maybe<wai.RecordsList<location.Location>>
  >;

  get optionSource (): OptionsSource {
    const source = {
      fetch: async (): Promise<app.Maybe<Option[]>> => {
        const list = await this.fetchLocations();
        if (!list) return;

        return list.records.map(
          location => ({
            value: location.id ?? '-1',
            text: `${location.name[1]} (${location.name[0]})`,
          }),
        );
      },
    };
    (source as any).__parent = this.parentValue; // so that it reloads when father changes
    return source;
  }
}
</script>
