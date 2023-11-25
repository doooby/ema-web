<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { course } from '~/lib/records';
import { RecordLoaderState } from '~/components/database/pages/loaders/RecordLoader.vue';
import TextNames from '~/components/database/components/TextNames.vue';
import ShowPageAction from '~/components/database/ShowPageAction.vue';
import EntityNameHeader from '~/components/database/pages/show/EntityNameHeader.vue';
import ShowPageTableRow from '~/components/database/ShowPageTableRow.vue';
import BRecordLink from '~/components/database/components/BRecordLink.vue';

@Component({
  components: {
    BRecordLink,
    ShowPageTableRow,
    EntityNameHeader,
    ShowPageAction,
    TextNames,
  },
})
export default class CourseShow extends Vue {
  @Prop({ required: true }) readonly recordLoader!: RecordLoaderState<course.V3_Course>;

  get course (): undefined | course.V3_Course {
    return this.recordLoader?.record;
  }
}
</script>

<template>
  <div>
    <EntityNameHeader
      :record="course?.record"
      :name="course?.record?.name"
    />

    <div class="row">

      <div class="col-md-4 col-lg-3">
        <ul v-if="course">
          <li v-if="$admission.can('courses.update')">
            <show-page-action
              icon="pencil"
              :path="`/database/courses/${course.id}/edit`"
            >
              <t value="db.page.edit.action" />
            </show-page-action>
          </li>
        </ul>
      </div>

      <div class="col emb-6">
        <table v-if="course?.record" class="table">
          <show-page-table-row label="db.record.schools.meta.s">
            <b-record-link
              entity="schools"
              :record="course.record.school"
            />
          </show-page-table-row>
          <show-page-table-row label="db.record.courses.label.education_level">
            <b-record-link
              entity="education_levels"
              :record="course.record.education_level"
            />
          </show-page-table-row>
          <show-page-table-row label="db.record.courses.label.grade">
            {{ course.record.grade }}
          </show-page-table-row>
          <show-page-table-row label="db.record.courses.label.school_year">
            <b-record-link
              v-if="course.record.school_year"
              entity="school_years"
              :record="course.record.school_year"
            />
          </show-page-table-row>
        </table>
      </div>
    </div>

    <div>
      <!--      <slot name="container" :record="record" :reload-record="reloadRecord" />-->
    </div>
  </div>
</template>
