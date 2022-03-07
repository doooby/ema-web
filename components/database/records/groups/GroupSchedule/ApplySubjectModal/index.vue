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
      />
    </div>
  </b-modal>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Subject } from '~/lib/records';
import { buildFormFields, prefillFormValues } from '~/components/Form';
import RecurrenceSelection
  from '~/components/database/records/groups/GroupSchedule/ApplySubjectModal/RecurrenceSelection.vue';

@Component
export default class ApplySubjectModal extends Vue {
  @Prop({ required: true }) readonly value!: boolean;
  @Prop({ required: true }) readonly subject!: Subject;
  @Prop({ required: true }) readonly date!: Date;

  formFields = buildFormFields([
    [ 'date', 'calendar' ],
    [ 'recurrence', RecurrenceSelection.asControl ],
  ]);

  formValues = prefillFormValues(this.formFields, { date: this.date });

  onHidden () {
    this.$emit('input', false);
  }

  onSubmit () {
    this.$emit('submit', {
      subject: this.subject,
      dateStart: this.formValues.date,
    });
  }
}
</script>
