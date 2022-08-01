<template>
  <subjects-listing
    v-if="getSettingsQueryState.value"
    :course-guideline="courseGuideline"
    :settings="getSettingsQueryState.value.subjects"
    @updated="reloadSettings"
  />
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { StandardizedCourse, Subject } from '~/lib/records';
import * as mappers from '~/lib/api/mappers';
import SubjectsListing from '~/components/database/records/course_guidelines/CourseSettings/SubjectsListing.vue';

export interface SubjectSetting {
  id: number;
  subject: mappers.AssociatedRecord<Subject>;
  mandatory: any;
  periodsPerWeek: any;
  periodsTotal: any;
}

interface Settings {
  subjects: SubjectSetting[];
}

@Component({
  components: { SubjectsListing },
})
export default class CourseSettings extends Vue {
  @Prop({ required: true }) readonly course!: StandardizedCourse;

  getSettingsQueryState = this.$api.newQueryState<Settings>();

  @Watch('course')
  onPageChanged () {
    this.reloadSettings();
  }

  mounted () {
    this.reloadSettings();
  }

  reloadSettings () {
    this.getSettingsQueryState.reset();
    this.fetchSettings();
  }

  async fetchSettings () {
    await this.$api.request({
      path: `/course_guidelines/${this.course.id}/show_settings`,
      mapper: mapSetting,
    }, this.getSettingsQueryState);
  }
}

function mapSetting (value: any): Settings {
  return mappers.object(value, (root) => {
    const associations = mappers.prop('associations', root, mappers.createAssociationsMapper<{
      subject: mappers.AssociatedRecordsIndex,
    }>(
      'subject',
    ));

    const subjects: SubjectSetting[] = [];
    mappers.prop('subjects', root, mappers.val.factories.listOfObjects((subjectItem) => {
      const subject = associations.subject[mappers.recordId(subjectItem)];
      if (subject) {
        subjects.push({
          id: subject.id,
          subject,
          mandatory: mappers.prop('mandatory', subjectItem, mappers.val.boolean),
          periodsPerWeek: mappers.prop('periods_per_week', subjectItem, mappers.val.integer),
          periodsTotal: mappers.prop('periods_total', subjectItem, mappers.val.integer),
        });
      }
    }));

    return {
      subjects,
    };
  });
}
</script>
