<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import controls from '~/components/controls';
import { OptionsSelect } from '~/components/controls/inputs';
import app from '~/lib/app';

const FIELD_NAME = 'reasons';

@Component({
  components: { OptionsSelect },
})
export default class DropoutReasons extends Vue {
  @Prop({ required: true }) readonly controls!: controls.Group;
  @Prop() readonly disabled?: boolean;

  static asField (baseDefinition?: Partial<controls.FieldDefinition>): controls.FieldDefinition {
    return {
      ...baseDefinition,
      name: FIELD_NAME,
    };
  }

  get value (): any {
    const value = this.controls.getValue(FIELD_NAME);
    if (!Array.isArray(value)) return;
    return value
      .map(item => this.options.find(option => option.value === item))
      .filter(self => self);
  }

  get options () {
    return app.internalOptionsList3(this, 'dropout_reasons');
  }

  onChange (value) {
    this.controls.update(FIELD_NAME, value.map(item => item.value));
  }
}
</script>

<template>
  <b-form-group
    :class="$attrs.class"
  >
    <template #label>
      <t value="views.group.dropout.controls.DropoutReasons.label" />
    </template>
    <OptionsSelect
      :value="value"
      :multiple="true"
      :disabled="disabled"
      :options="options"
      max-height="250"
      @change="onChange"
    >
      <template #option-content="{ option }">
        <t :value="option.item" />
      </template>
    </OptionsSelect>
  </b-form-group>
</template>
