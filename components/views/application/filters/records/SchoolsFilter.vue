<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import controls from '~/components/controls';
import { BRecordsSelect } from '~/components/controls/inputs';
import FieldWithLabel from '~/components/controls/fields/FieldWithLabel.vue';

@Component({
  components: { FieldWithLabel, BRecordsSelect },
})
export default class SchoolsFilter extends Vue {
  @Prop({ required: true }) readonly controls!: controls.Group;
  @Prop({ required: true }) readonly fieldName!: string;

  static asField (name: string, param: string) {
    return controls.inputs.BRecordsSelect.asField.records(name, param);
  }
}
</script>

<template>
  <FieldWithLabel
    v-slot="{ value, onChange }"
    :class="$attrs.class"
    :controls="controls"
    :name="fieldName"
    label="_app.filters.records.SchoolsFilter.label"
  >
    <BRecordsSelect
      :value="value"
      entity="schools"
      :multiple="true"
      @change="onChange"
    />
  </FieldWithLabel>
</template>
