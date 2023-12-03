<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import controls from '~/components/controls';
import FieldWithLabel from '~/components/controls/fields/FieldWithLabel.vue';
import app from '~/lib/app';
import OptionsSelect from '~/components/controls/inputs/base/OptionsSelect.vue';

@Component({
  components: { OptionsSelect, FieldWithLabel },
})
export default class HasDropoutFilter extends Vue {
  @Prop({ required: true }) readonly controls!: controls.Group;
  @Prop({ required: true }) readonly fieldName!: string;

  static asField (name: string, param: string) {
    return controls.inputs.BRecordsSelect.asField.option(name, param);
  }

  options = app.country.defaults.options.onlyExclude()
}
</script>

<template>
  <FieldWithLabel
    v-slot="{ value, onChange }"
    :class="$attrs.class"
    :controls="controls"
    :name="fieldName"
    label="student.filters.HasDropoutFilter.label"
  >
    <OptionsSelect
      :value="value"
      :options="options"
      @change="onChange"
    >
      <template #option-content="{ option, selected }">
        <input type="radio" :checked="selected" class="mr-1">
        <t :value="option.item" />
      </template>
    </OptionsSelect>
  </FieldWithLabel>
</template>
