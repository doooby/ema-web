<template>
  <b-modal
    :visible="value"
    @hidden="onHidden"
    @ok="onSubmit"
  >
    <template #modal-title>
      Schedule a Subject
    </template>
    <div v-if="value">
      {{ subject.name_en }}
      <br>
      <small>{{ subject.name }}</small>
      <br>
      <br>
      <form-group
        v-model="formValues"
        :fields="formFields"
        label-prefix="db.record.groups.schedule.applySubject"
      />
    </div>
  </b-modal>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Subject } from '~/lib/records';
import { buildFormFields, prefillFormValues } from '~/components/Form';
import RecurrenceSelection
, { Value as RecurrenceValue } from '~/components/database/records/groups/GroupSchedule/ApplySubjectModal/RecurrenceSelection.vue';
import addDays from 'date-fns/addDays';
import times from 'lodash/times';
import fnsFormat from 'date-fns/format';

export interface Result {
  subject: Subject;
  day: number;
  recurrence: RecurrenceValue;
}

@Component
export default class ApplySubjectModal extends Vue {
  @Prop({ required: true }) readonly value!: boolean;
  @Prop({ required: true }) readonly subject!: Subject;
  @Prop({ required: true }) readonly date!: Date;

  formFields = buildFormFields([
    [ 'day', 'select', { options: buildDayOptions(this.date) } ],
    [ 'recurrence', RecurrenceSelection.asControl ],
  ]);

  formValues = prefillFormValues(this.formFields, {
    day: 0,
  });

  onHidden () {
    this.$emit('input', false);
  }

  onSubmit () {
    this.$emit('submit', {
      subject: this.subject,
      day: this.formValues.day,
      recurrence: this.formValues.recurrence,
    } as Result);
  }
}

function buildDayOptions (date: Date) {
  return times(7, (index: number) => {
    const day = addDays(date, index);
    return {
      value: index,
      text: fnsFormat(day, 'EEEE'),
    };
  });
}
</script>
