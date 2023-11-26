<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import controls from '~/components/controls';
import { DateInput } from '~/components/controls/inputs';

const FIELD_NAME = 'dropout_on';

@Component({
  components: { DateInput },
})
export default class DropoutOn extends Vue {
  @Prop({ required: true }) readonly controls!: controls.Group;
  @Prop() readonly disabled?: boolean;

  static asField (baseDefinition?: Partial<controls.FieldDefinition>): controls.FieldDefinition {
    return {
      ...baseDefinition,
      name: FIELD_NAME,
    };
  }

  get value (): any {
    return this.controls.getValue(FIELD_NAME);
  }

  onChange (value) {
    this.controls.update(FIELD_NAME, value ?? '');
  }
}
</script>

<template>
  <b-form-group
    :class="$attrs.class"
  >
    <template #label>
      <t value="views.group.dropout.controls.DropoutOn.label" />
    </template>
    <DateInput
      :value="value"
      :disabled="disabled"
      @change="onChange"
    />
  </b-form-group>
</template>
