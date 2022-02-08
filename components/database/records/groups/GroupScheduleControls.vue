<template>
  <form-group
    v-model="formValues"
    :fields="formFields"
    @change="onDateChange"
  >
    <template #layout="{ context, values }">
      <div class="d-flex align-items-center">
        <b-button variant="outline-secondary" class="emr-2" @click="onSetPreviousWeek">
          <b-icon icon="chevron-left" />
        </b-button>
        <form-field
          name="date"
          :context="context"
          :values="values"
        />
        <b-button variant="outline-secondary" class="eml-2" @click="onSetNextWeek">
          <b-icon icon="chevron-right" />
        </b-button>
      </div>
    </template>
  </form-group>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { buildFormFields, prefillFormValues } from '~/components/Form';
import addWeeks from 'date-fns/addWeeks';

@Component
export default class GroupScheduleControls extends Vue {
  @Prop({ required: true }) readonly value!: Date;

  formFields = buildFormFields([
    [ 'date', 'calendar' ],
  ]);

  formValues = prefillFormValues(this.formFields, { date: this.value });

  @Watch('value')
  onValueChanged (newValue: Date) {
    this.formValues.date = newValue;
  }

  onDateChange (): void {
    this.$emit('input', this.formValues.date);
  }

  onSetPreviousWeek (): void {
    this.$emit('input', addWeeks(this.formValues.date, -1));
  }

  onSetNextWeek (): void {
    this.$emit('input', addWeeks(this.formValues.date, 1));
  }
}
</script>
