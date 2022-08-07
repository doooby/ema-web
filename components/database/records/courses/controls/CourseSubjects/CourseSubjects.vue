<template>
  <b-form-group>
    <template #label>
      <t :value="labelTranslation" />
    </template>
    <items-listing
      :columns="columns"
      :items="items"
      @add="selectSubjectModalShown = true"
      @change="onChange"
    >
      <template #cell-subject="{ item }">
        <div class="single-row-cell">
          <show-record-link
            entity="subjects"
            :record="{ id: item.subject.id, caption: item.subject.labels.caption }"
          />
        </div>
      </template>
      <template #cell-teacher="{ item }">
        <div class="single-row-cell">
          <show-record-link
            v-if="item.teacher"
            entity="people"
            :record="{ id: item.teacher.id, caption: item.teacher.labels.caption }"
          />
        </div>
      </template>
      <template #cell-grading>
        <div class="single-row-cell">
          shooot
        </div>
      </template>
      <template #cell-exam="{ item }">
        <div class="single-row-cell">
          <checkbox-input
            class="mr-2"
            :value="item.exam"
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
import { CourseSubject, Subject } from '~/lib/records';
import { AssociatedRecord } from '~/lib/api/mappers';
import ShowRecordLink from '~/components/database/ShowRecordLink.vue';
import SearchModal from '~/components/database/SearchModal.vue';
import CheckboxInput from '~/components/Form/primitives/CheckboxInput.vue';

@Component({
  mixins: [ ControlMixin ],
  components: { ShowRecordLink, SearchModal, CheckboxInput },
})
export default class CourseSubjects extends Vue {
  static fieldType: FormFieldType = {};

  @Prop({ required: true }) field!: FormField;
  @Prop({ required: true }) context!: FormGroupContext;
  @Prop({ required: true }) formValues!: FormValues;

  get items (): CourseSubject[] {
    return this.formValues[this.field.name] ?? [];
  }

  get currentCountryId (): null | number {
    return this.$store.state.session.currentCountry?.id ?? null;
  }

  selectSubjectModalShown = false;
  columns = [
    { name: 'subject' },
    { name: 'teacher' },
    { name: 'grading' },
    { name: 'exam' },
  ];

  onAddSubject (subject: AssociatedRecord<Subject>) {
    this.selectSubjectModalShown = false;
    const newItems = [ ...this.items ];
    newItems.push(createEmptyItem(subject));
    this.context.onChange({ [this.field.name]: newItems });
  }

  onChange (newItems: CourseSubject[]) {
    this.context.onChange({ [this.field.name]: newItems });
  }
}

function createEmptyItem (subject: AssociatedRecord<Subject>): CourseSubject {
  return Object.freeze({
    subject,
    exam: false,
    grading: [ '', '', undefined ],
  });
}
</script>
