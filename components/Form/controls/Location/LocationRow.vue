<template>
  <div>
    <small class="emb-2">
      {{ definition.level.name }} ({{ definition.level.name_en }})
    </small>
    <br>
    <select-with-modal
      v-if="definition.level.type === 'list'"
      :value="value"
      :disabled="disabled"
      :options-source="optionSource"
      @select="onValueChange"
    >
      <template #modal-title>
        {{ definition.level.name }} ({{ definition.level.name_en }})
      </template>
    </select-with-modal>
    <div v-if="definition.level.type === 'text'">
      <text-input :value="value" :disabled="disabled" @input="onValueChange" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Location, LocationSystemLevel } from '~/lib/records';
import SelectWithModal, { OptionsSource } from '~/components/Form/primitives/SelectWithModal.vue';
import { MaybeData, Option } from '~/lib/types';
import TextInput from '~/components/Form/primitives/TextInput.vue';

export interface Definition {
  levelIndex: number;
  level: LocationSystemLevel;
  parentListLevelIndex: null | number;
  fetchLocations(level: number, parentId?: string): Promise<MaybeData<Location[]>>;
}

@Component({
  components: { SelectWithModal, TextInput },
})
export default class LocationRow extends Vue {
  @Prop({ required: true }) definition!: Definition;
  @Prop({ required: true }) value!: undefined | string;
  @Prop({ required: true }) parentLocationId!: undefined | string;
  @Prop({ required: true }) disabled!: boolean;

  get optionSource (): OptionsSource {
    const levelNum = this.definition.levelIndex + 1;
    const parentId = this.parentLocationId;
    if (this.disabled || this.definition.level.type !== 'list') {
      return { list: [] };
    }
    return {
      fetch: async (): Promise<MaybeData<Option[]>> => {
        const locations = await this.definition.fetchLocations(
          levelNum,
          parentId,
        );
        if (!locations.ok) return locations;
        return {
          ok: true,
          data: locations.data.map(location => ({
            value: location.id,
            text: location.name,
          })),
        };
      },
    };
  }

  onValueChange (value: string) {
    this.$emit('change', { index: this.definition.levelIndex, value });
  }
}
</script>
