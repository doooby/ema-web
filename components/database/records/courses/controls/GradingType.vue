<template>
  <b-form-group
    :label-for="`${domIdBase}_min`"
  >
    <template #label>
      <t :value="labelTranslation" />
    </template>

    <ul>
      <li>
        <div class="d-flex">
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <t value="app.common.label.min" />
              </span>
            </div>
            <input
              :id="`${domIdBase}_min`"
              type="text"
              class="form-control"
              maxlength="2"
              :value="sanitizedValue[0]"
              autocomplete="off"
              @blur="onInput(0, $event)"
            >
          </div>
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <t value="app.common.label.max" />
              </span>
            </div>
            <input
              :id="`${domIdBase}_max`"
              type="text"
              class="form-control"
              maxlength="2"
              :value="sanitizedValue[1]"
              autocomplete="off"
              @blur="onInput(1, $event)"
            >
          </div>
        </div>
      </li>

      <li>
        <div class="d-flex">
          <checkbox-input
            :value="sanitizedValue[2] !== undefined"
            @change="onLimitCheckChange"
          />
          <t value="db.record.courses.grading_type.required_limit" />
          <input
            type="text"
            class="form-control ml-3"
            maxlength="2"
            :disabled="sanitizedValue[2] === undefined"
            :value="sanitizedValue[2]"
            autocomplete="off"
            @blur="onInput(2, $event)"
          >
        </div>
      </li>
    </ul>
  </b-form-group>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import ControlMixin from '~/components/Form/ControlMixin';
import { FormField, FormFieldType, FormGroupContext, FormValues } from '~/components/Form';
import CheckboxInput from '~/components/Form/primitives/CheckboxInput.vue';

@Component({
  mixins: [ ControlMixin ],
  components: { CheckboxInput },
})
export default class GradingType extends Vue {
  static fieldType: FormFieldType = {
    fillParams ({ name }, values, record) {
      record[name] = values[name] ?? [ '', '' ];
      return record;
    },
  };

  @Prop({ required: true }) field!: FormField;
  @Prop({ required: true }) context!: FormGroupContext;
  @Prop({ required: true }) formValues!: FormValues;

  get sanitizedValue (): [string, string, undefined | string] {
    const value = this.formValues[this.field.name];
    if (Array.isArray(value)) {
      return [
        value[0],
        value[1],
        value[2],
      ];
    } else {
      return [ '', '', undefined ];
    }
  }

  onInput (index: number, event: {target: HTMLInputElement}): void {
    const newValue = [ ...this.sanitizedValue ];
    newValue[index] = event.target.value;
    this.context.onChange({ [this.field.name]: newValue });
  }

  onLimitCheckChange (check: boolean) {
    const newValue = [ ...this.sanitizedValue ];
    newValue[2] = check ? '' : undefined;
    console.log(newValue);
    this.context.onChange({ [this.field.name]: newValue });
  }
}
</script>
