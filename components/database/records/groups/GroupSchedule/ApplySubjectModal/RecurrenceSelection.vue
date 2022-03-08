<template>
  <b-form-group>
    <template #label>
      <t :value="labelTranslation" />
    </template>
    <b-form-radio-group :checked="value.option">
      <div>
        <b-form-radio value="regular" @change="onSelectRegular">
          <t value="db.record.groups.schedule.apply_subject.recurrence_regular.label" />
        </b-form-radio>
      </div>
      <div>
        <b-form-radio value="irregular" @change="onSelectIrregular">
          <t value="db.record.groups.schedule.apply_subject.recurrence_irregular.label" />
        </b-form-radio>
        <div v-if="value.option === 'irregular'">
          <div class="d-flex flex-wrap">
            <b-form-select
              :value="value.eachWeek"
              :options="perWeekOptions"
              class="form-control"
              @change="onEachWeekChange"
            />
          </div>
          <div class="d-flex flex-wrap">
            <t value="db.record.groups.schedule.apply_subject.recurrence_irregular.repeat_times" />
            <b-form-input
              :value="value.times"
              type="number"
              class="form-control"
              min="1"
              max="20"
              @change="onTimesChange"
            />
          </div>
        </div>
      </div>
    </b-form-radio-group>
  </b-form-group>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { FormField, FormFieldType, FormGroupContext, FormValues } from '~/components/Form';
import ControlMixin from '~/components/Form/ControlMixin';
import { sanitizeValue } from '~/components/Form/controls/Integer.vue';

export type Value = {
  option: 'regular' | 'irregular';
  eachWeek: undefined | 1 | 2;
  times: undefined | number;
}

@Component({
  mixins: [ ControlMixin ],
})
export default class RecurrenceSelection extends Vue {
  static fieldType: FormFieldType = {
    mapToValues ({ name }: FormField, _record: any, values: FormValues = {}) {
      values[name] = buildDefault('regular');
      return values;
    },
    mapToRecordParams ({ name }: FormField, values: FormValues, record: any = {}) {
      // record[name] = String(values[name]) || '';
      return record;
    },
  }

  static get asControl (): FormFieldType {
    return {
      ...this.fieldType,
      control: RecurrenceSelection,
    };
  }

  @Prop({ required: true }) field!: FormField;
  @Prop({ required: true }) context!: FormGroupContext;
  @Prop({ required: true }) formValues!: FormValues;

  perWeekOptions = [
    { value: 1, text: 'each Week' },
    { value: 2, text: 'each other Week' },
  ];

  get value (): Value {
    return this.formValues[this.field.name];
  }

  changeValue (value: Value) {
    this.context.onChange({ [this.field.name]: value });
  }

  onSelectRegular (): void {
    this.changeValue(buildDefault('regular'));
  }

  onSelectIrregular (): void {
    this.changeValue(buildDefault('irregular'));
  }

  onEachWeekChange (value: any) {
    this.changeValue({
      ...this.value,
      eachWeek: value,
    });
  }

  onTimesChange (value: any) {
    this.changeValue({
      ...this.value,
      times: sanitizeValue(value),
    });
  }
}

function buildDefault (option: Value['option']): Value {
  switch (option) {
    case 'regular':
      return {
        option: 'regular',
        eachWeek: undefined,
        times: undefined,
      };
    case 'irregular':
      return {
        option: 'irregular',
        eachWeek: 1,
        times: 1,
      };
  }
}
</script>
