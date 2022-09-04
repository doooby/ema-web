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
      <template #header-grading>
        <t value="db.record.courses.subjects.label.grading" />
      </template>
      <template #header-exam>
        <t value="db.record.courses.subjects.label.exam" />
      </template>
      <template #cell-subject="{ item }">
        <show-record-link
          entity="subjects"
          :record="{ id: item.subject.id, caption: item.subject.labels.caption }"
        />
      </template>
      <template #cell-grading="{ item, index }">
        <div class="single-row-cell">
          <course-grading
            :value="item.grading"
            @change="onUpdateItem(index, item, 'grading', $event)"
          />
        </div>
      </template>
      <template #cell-exam="{ item, index }">
        <div class="single-row-cell">
          <checkbox-input
            class="mr-2"
            :value="item.exam"
            @change="onUpdateItem(index, item, 'exam', $event)"
          >
            <t value="app.common.label.required" />
          </checkbox-input>
        </div>
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
        :query="$api.queries.subjects.searchAssociated"
        :params="{ country_id: currentCountryId }"
        :selected-ids="items.map(item => item.id)"
        @select="onAddSubject"
      />
    </b-modal>
  </b-form-group>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ControlMixin from '~/components/Form/ControlMixin';
import { FormField, FormFieldType, FormGroupContext, FormValues } from '~/components/Form';
import { StandardizedCourseSubject, Subject } from '~/lib/records';
import { AssociatedRecord } from '~/lib/api/mappers';
import ShowRecordLink from '~/components/database/ShowRecordLink.vue';
import SearchModal from '~/components/database/SearchModal.vue';
import CheckboxInput from '~/components/Form/primitives/CheckboxInput.vue';
import CourseGrading from '~/components/database/controls/primitives/CourseGrading.vue';

@Component({
  mixins: [ ControlMixin ],
  components: { ShowRecordLink, SearchModal, CheckboxInput, CourseGrading },
})
export default class SubjectsField extends Vue {
  static fieldType: FormFieldType = {
    fillParams ({ name }: FormField, values: FormValues, record: any): any {
      let value = values[name];
      if (value) {
        value = value.map(({ subject, ...item }: StandardizedCourseSubject) => {
          if (!item.exam) delete item.exam;
          return ({
            ...item,
            subject_id: subject.id,
          });
        });
      }
      record[name] = value;
    },
  };

  @Prop({ required: true }) field!: FormField;
  @Prop({ required: true }) context!: FormGroupContext;
  @Prop({ required: true }) formValues!: FormValues;

  get items (): StandardizedCourseSubject[] {
    return this.formValues[this.field.name] ?? [];
  }

  get currentCountryId (): null | number {
    return this.$store.state.session.currentCountry?.id ?? null;
  }

  selectSubjectModalShown = false;
  columns = [
    { name: 'subject' },
    { name: 'grading', size: 250 },
    { name: 'exam', size: 100 },
  ];

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
    item: StandardizedCourseSubject,
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
