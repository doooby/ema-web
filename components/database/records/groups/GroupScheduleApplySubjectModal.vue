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
    </div>
  </b-modal>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Subject } from '~/lib/records';

@Component
export default class GroupScheduleApplySubjectModal extends Vue {
  @Prop({ required: true }) readonly value!: boolean;
  @Prop({ required: true }) readonly subject!: Subject;
  @Prop({ required: true }) readonly date!: Date;

  onHidden () {
    this.$emit('input', false);
  }

  onSubmit () {
    this.$emit('submit', {
      subject: this.subject,
      dateStart: this.date,
    });
  }
}
</script>
