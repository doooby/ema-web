<template>
  <b-form-group>
    <template #label>
      <t :value="labelTranslation" />
    </template>
    <items-listing
      :columns="columns"
      :items="items"
      @add="selectSubjectModalShown = true"
      @change="onChangeValue"
    >
      <template #header-subject>
        <t value="db.record.subjects.meta.s" />
      </template>
      <template #header-grading>
        <t value="db.record.courses.subjects.label.grading" />
      </template>
      <template #header-exam>
        <t value="db.record.courses.subjects.label.exam" />
      </template>
      <template #cell-subject="{ item }">
        <b-record-link
          entity="subjects"
          :record="item.subject"
        />
      </template>
      <template #cell-grading="{ item, index }">
        <course-grading
          :value="item.grading"
          @change="onUpdateItem(index, item, 'grading', $event)"
        />
      </template>
      <template #cell-exam="{ item, index }">
        <checkbox-input
          class="mr-2"
          :value="item.exam"
          @change="onUpdateItem(index, item, 'exam', $event)"
        >
          <t value="app.common.label.required" />
        </checkbox-input>
      </template>
    </items-listing>
    <search-b-records-modal
      v-model="selectSubjectModalShown"
      entity="subjects"
      :selected="subjects"
      @select="onAddSubject"
    />
  </b-form-group>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ControlMixin from '~/components/Form/ControlMixin';
import { FormField, FormFieldType, FormGroupContext, FormValues } from '~/components/Form';
import { course } from '~/lib/records';
import CheckboxInput from '~/components/Form/primitives/CheckboxInput.vue';
import CourseGrading from '~/components/database/controls/primitives/CourseGrading.vue';
import { BRecord } from '~/lib/api2';
import SearchBRecordsModal from '~/components/database/modals/SearchBRecordsModal.vue';
import BRecordLink from '~/components/database/components/BRecordLink.vue';

@Component({
  mixins: [ ControlMixin ],
  components: {
    BRecordLink,
    SearchBRecordsModal,
    CheckboxInput,
    CourseGrading,
  },
})
export default class SubjectsField extends Vue {
  static fieldType: FormFieldType = {
    fillParams ({ name }: FormField, values: FormValues, record: any): any {
      let value = values[name];
      if (value) {
        value = value.map(({ subject, ...item }: course.CourseSubject) => {
          const processedItem: any = { ...item, subject_id: subject.id };
          if (!processedItem.exam) delete processedItem.exam;
          return processedItem;
        });
      }
      record[name] = value;
    },
  };

  @Prop({ required: true }) field!: FormField;
  @Prop({ required: true }) context!: FormGroupContext;
  @Prop({ required: true }) formValues!: FormValues;

  get items (): course.CourseSubject[] {
    return (this as any).rawValue ?? [];
  }

  get subjects (): BRecord[] {
    return this.items.map(item => item.subject);
  }

  selectSubjectModalShown = false;
  columns = [
    { name: 'subject' },
    { name: 'grading', size: 250 },
    { name: 'exam', size: 100 },
  ];

  onAddSubject (subject: BRecord) {
    this.selectSubjectModalShown = false;
    const newItems = [ ...this.items ];
    newItems.push(
      Object.freeze({
        subject,
        exam: false,
        grading: this.formValues.preferred_grading,
      }),
    );
    Object.freeze(newItems);
    (this as any).onChangeValue(newItems);
  }

  onUpdateItem (
    index: number,
    item: any,
    field: string,
    value: any,
  ) {
    const newItems = [ ...this.items ];
    newItems[index] = Object.freeze({
      ...item,
      [field]: value,
    });
    Object.freeze(newItems);
    (this as any).onChangeValue(newItems);
  }
}
</script>
