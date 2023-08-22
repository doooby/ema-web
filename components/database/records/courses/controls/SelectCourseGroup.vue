<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import BRecordsSelect from '~/components/database/controls/BRecordsSelect.vue';
import { BRecord } from '~/lib/api2';

export interface CourseGroup {
  school: null | BRecord;
  course: null | BRecord;
  group: null | BRecord;
}

@Component({
  components: { BRecordsSelect },
})
export default class SelectCourseGroup extends Vue {
  @Prop({ required: true }) readonly value!: CourseGroup;
  @Prop({ default: undefined }) readonly domId!: string;

  onChangeSchool (schools: BRecord[]): void {
    this.value.school = schools[0] ?? null;
    this.value.course = null;
    this.value.group = null;
  }

  onChangeCourse (courses: BRecord[]): void {
    this.value.course = courses[0] ?? null;
    this.value.group = null;
  }
}
</script>

<template>
  <div :class="[ $attrs.class ]">
    <b-form-group :label-for="`${domId}_school`">
      <template #label>
        <t value="db.record.schools.meta.s" />
      </template>
      <b-records-select
        :dom-id="`${domId}_school`"
        entity="schools"
        :single-record="true"
        title="db.record.schools.meta.s"
        :records="value.school ? [value.school] : []"
        @change="onChangeSchool"
      />
    </b-form-group>
    <b-form-group :label-for="`${domId}_course`">
      <template #label>
        <t value="db.record.courses.meta.s" />
      </template>
      <b-records-select
        :dom-id="`${domId}_course`"
        entity="courses"
        :single-record="true"
        title="db.record.courses.meta.s"
        :records="value.course ? [value.course] : []"
        :params="value.school ? { school_id: value.school.id } : undefined"
        :disabled="value.school === null"
        @change="onChangeCourse"
      />
    </b-form-group>
    <b-form-group :label-for="`${domId}_group`">
      <template #label>
        <t value="db.record.groups.meta.s" />
      </template>
      <b-records-select
        :dom-id="`${domId}_group`"
        entity="groups"
        :single-record="true"
        title="db.record.groups.meta.s"
        :records="value.group ? [value.group] : []"
        :params="value.course ? { course_id: value.course.id } : undefined"
        :disabled="value.course === null"
        @change="value.group = $event[0] ?? null"
      />
    </b-form-group>
    <b-alert
      show
      variant="info"
    >
      <t value="db.pages.people.move_students.empty_group" />
    </b-alert>
  </div>
</template>
