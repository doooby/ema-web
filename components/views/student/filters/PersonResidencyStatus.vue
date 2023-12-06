<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import app from '~/lib/app';
import FieldWithLabel from '~/components/controls/fields/FieldWithLabel.vue';
import controls from '~/components/controls';
import { DropdownSelect } from '~/components/controls/inputs';
import { emptyOption } from '~/lib/app/country/defaults/options';

@Component({
  components: {
    FieldWithLabel,
    DropdownSelect,
  },
})
export default class PersonResidencyStatus extends Vue {
  @Prop({ required: true }) readonly controls!: controls.Group;
  @Prop({ required: true }) readonly fieldName!: string;

  static asField (name: string, param: string) {
    return controls.inputs.BRecordsSelect.asField.option(name, param);
  }

  get options () {
    return [
      app.country.defaults.options.emptyOption(),
      ...app.internalOptionsList3(this, 'residency_status'),
      app.country.defaults.options.otherOption(),
    ];
  }
}
</script>

<template>
  <FieldWithLabel
    v-slot="{ value, onChange }"
    :class="$attrs.class"
    :controls="controls"
    :name="fieldName"
    label="student.filters.PersonResidencyStatus.label"
  >
    <DropdownSelect
      :value="value"
      :options="options"
      @change="onChange"
    >
      <template #content="{ option }">
        <t v-if="option?.item" :value="option.item" />
      </template>
      <template #option-content="{ option, selected }">
        <t v-if="option.item" :value="option.item" />
        <span v-else>&nbsp;</span>
      </template>
    </DropdownSelect>
  </FieldWithLabel>
</template>
