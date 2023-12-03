<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import controls from '~/components/controls';
import { BRecordsSelect } from '~/components/controls/inputs';
import FieldWithLabel from '~/components/controls/fields/FieldWithLabel.vue';
import { Params } from '~/lib/api2';

@Component({
  components: { FieldWithLabel, BRecordsSelect },
})
export default class GroupsFilter extends Vue {
  @Prop({ required: true }) readonly controls!: controls.Group;
  @Prop({ required: true }) readonly fieldName!: string;
  @Prop() params?: Params;

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
    label="_app.filters.records.GroupsFilter.label"
  >
    <BRecordsSelect
      :value="value"
      entity="groups"
      :multiple="true"
      :params="params"
      @change="onChange"
    />
  </FieldWithLabel>
</template>
