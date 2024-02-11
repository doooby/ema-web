<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import app from '~/lib/app';
import { location_system, location } from '~/lib/records';
import DropdownSelect from '~/components/controls/inputs/extended/DropdownSelect.vue';
import { wai } from '~/vendor/wai';
import TextNames from '~/components/database/components/TextNames.vue';

@Component({
  components: { TextNames, DropdownSelect },
})
export default class LocationLevelSelect extends Vue {
  @Prop() readonly disabled?: boolean;
  @Prop({ required: true }) readonly system!: app.Maybe<location_system.V3_LocationSystem>;
  @Prop({ required: true }) readonly level!: number;
  @Prop() readonly parentValue?: string;
  @Prop() readonly value?: string;

  options: app.OptionItem<location.Location>[] = [];

  created () {
    this.onUpdateOptions();
  }

  get state () {
    return {
      disabled: this.disabled || (this.level > 1 && !this.parentValue),
      system: this.system,
      level: this.level,
      parentValue: this.parentValue,
    };
  }

  get selectedOption () {
    return this.options.find(option => option.value === this.value);
  }

  @Watch('state')
  async onUpdateOptions () {
    if (!this.state.system || this.state.disabled) {
      this.options = [];
      return;
    }

    const { okPayload } = await this.$api2.V3_request({
      path: '/locations',
      params: {
        per_page: 100,
        location_system_id: this.state.system.id,
        level: this.state.level,
        parent_id: this.state.parentValue,
      },
      reducer: value => wai.recordsList(value, location.parseRecord),
    });

    this.options = (okPayload?.records ?? []).map(
      record => ({ value: record.id ?? '-1', item: record }),
    );
  }
}
</script>

<template>
  <DropdownSelect
    :disabled="state.disabled"
    :options="options"
    :value="[ selectedOption ]"
    @input="$emit('input', $event?.[0]?.value)"
  >
    <template #content="{ option }">
      <TextNames
        :value="option?.item.name"
        :inline="true"
      />
    </template>
    <template #option-content="{ option }">
      <TextNames
        :value="option.item.name"
        :inline="true"
      />
    </template>
  </DropdownSelect>
</template>
