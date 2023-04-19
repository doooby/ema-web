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
      <template #header-teacher>
        <t value="db.record.courses.subjects.label.teacher" />
      </template>
      <template #header-grading>
        <t value="db.record.courses.subjects.label.grading" />
      </template>
      <template #header-exam>
        <t value="db.record.courses.subjects.label.exam" />
      </template>
      <template #cell-subject="{ item }">
        <show-record-link
          entity="subjects"
          :record="{ id: item.subject.id, caption: item.subject.caption }"
        />
      </template>
<!--      <template #cell-teacher="{ item }">-->
<!--        <AbbreviatedRecordSelect-->
<!--          entity="people"-->
<!--          :record="item.teacher"-->
<!--        />-->
<!--      </template>-->
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
    <b-modal
      v-model="selectSubjectModalShown"
      hide-footer
    >
      <template #modal-title>
        <t value="db.record.courses.subjects.add.title" />
      </template>
      <search-modal
        v-if="selectSubjectModalShown"
        :selected-records="subjects"
        :build-query="onBuildSearchQuery"
        @select="onAddSubject"
      />
    </b-modal>
  </b-form-group>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ControlMixin from '~/components/Form/ControlMixin';
import { FormField, FormFieldType, FormGroupContext, FormValues } from '~/components/Form';
import { course } from '~/lib/records';
import { AssociatedRecord } from '~/lib/api/mappers';
import ShowRecordLink from '~/components/database/ShowRecordLink.vue';
import SearchModal from '~/components/database/SearchModal.vue';
import CheckboxInput from '~/components/Form/primitives/CheckboxInput.vue';
import CourseGrading from '~/components/database/controls/primitives/CourseGrading.vue';
import * as mappers from '~/lib/api/mappers';
import AbbreviatedRecordSelect from '~/components/database/controls/AbbreviatedRecordSelect.vue';

@Component({
  mixins: [ ControlMixin ],
  components: { ShowRecordLink, SearchModal, CheckboxInput, CourseGrading, AbbreviatedRecordSelect },
})
export default class SubjectsField extends Vue {
  static fieldType: FormFieldType = {
    fillParams ({ name }: FormField, values: FormValues, record: any): any {
      let value = values[name];
      if (value) {
        // value = value.map(({ subject, teacher, ...item }: course.CourseSubject) => {
        value = value.map(({ subject, ...item }: course.CourseSubject) => {
          const processedItem: any = { ...item, subject_id: subject.id };
          if (!processedItem.exam) delete processedItem.exam;
          // if (teacher) processedItem.teacher_id = teacher.id;
          return processedItem;
        });
      }
      record[name] = value;
    },
  };

  @Prop({ required: true }) field!: FormField;
  @Prop({ required: true }) context!: FormGroupContext;
  @Prop({ required: true }) formValues!: FormValues;

  get items (): CourseSubject[] {
    return (this as any).rawValue ?? [];
  }

  get subjects (): mappers.AbbreviatedRecord[] {
    return this.items.map(item => item.subject);
  }

  selectSubjectModalShown = false;
  columns = [
    { name: 'subject' },
    { name: 'teacher' },
    { name: 'grading', size: 250 },
    { name: 'exam', size: 100 },
  ];

  onBuildSearchQuery () {
    return {
      path: '/subjects',
      mapper: mappers.paginatedAbbreviatedRecords,
    };
  }

  onAddSubject (subject: AssociatedRecord<Subject>) {
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
    item: CourseSubject,
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
