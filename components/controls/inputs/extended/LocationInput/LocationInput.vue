<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import app from '~/lib/app';
import { location_system } from '~/lib/records';
import { times } from 'lodash';
import TextNames from '~/components/database/components/TextNames.vue';
import LocationLevelSelect from '~/components/controls/inputs/extended/LocationInput/LocationLevelSelect.vue';
import TextInput from '~/components/controls/inputs/base/TextInput.vue';

@Component({
  components: { TextInput, TextNames, LocationLevelSelect },
})
export default class LocationInput extends Vue {
  @Prop() readonly domId?: string;
  @Prop() readonly disabled?: boolean;
  @Prop() readonly value?: string[];
  @Prop({ required: true }) readonly system!: app.Maybe<location_system.V3_LocationSystem>;

  get locationLevels () {
    const levels: location_system.LocationSystemLevel[] = [];
    times(this.system?.levels ?? 0, (index) => {
      levels[String(index)] = this.system?.settings[index];
    });
    return levels;
  }

  onChangeLevel (index, levelValue): void {
    const value = this.value ? [ ...this.value ] : [];
    value.length = index;
    value[index] = levelValue;
    this.$emit('input', value);
  }
}
</script>

<template>
  <div :class="$attrs.class">
    <div v-if="!system" class="alert alert-info">
      <t value="controls.LocationInput.missing_location_system" />
    </div>
    <div v-else :id="domId">
      <div
        v-for="(level, index) of locationLevels"
        :key="index"
        :class="{ 'mt-1': index > 0 }"
      >
        <TextNames
          class="font-14 mb-1"
          :value="level.name"
          :inline="true"
        />
        <LocationLevelSelect
          v-if="level.type === 'l'"
          :disabled="disabled"
          :system="system"
          :level="index + 1"
          :parent-value="value?.[index - 1]"
          :value="value?.[index]"
          @input="onChangeLevel(index, $event)"
        />
        <TextInput
          v-if="level.type === 't'"
          :disabled="disabled || (index > 0 && !value?.[index - 1])"
          :value="value?.[index]"
          @input="onChangeLevel(index, $event)"
        />
      </div>

    </div>
  </div>
</template>
