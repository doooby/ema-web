<script lang="ts">
import { DatabasePage } from '~/components';
import { Component } from 'vue-property-decorator';
import ShowPageTableRow from '~/components/database/ShowPageTableRow.vue';
import ShowPageAction from '~/components/database/ShowPageAction.vue';
import SubjectsListing from '~/components/database/records/courses/SubjectsListing.vue';
import CourseGroups from '~/components/database/records/courses/CourseGroups.vue';
import ShowRecordLink from '~/components/database/ShowRecordLink.vue';
import Show2Page from '~/components/database/pages/show/Show2Page.vue';
import BRecordLink from '~/components/database/components/BRecordLink.vue';
import PrintCourseTerms from '~/components/database/records/courses/PrintCourseTerms.vue';
import ArchiveRecordModal from '~/components/views/application/modals/ArchiveRecordModal.vue';
import ButtonToModal from '~/components/views/application/buttons/ButtonToModal.vue';
import RecordId from '~/components/views/application/RecordId.vue';
import { course } from '~/lib/records';
import HeaderRow, { RecordHeaderLabels } from '~/components/views/application/pages/show/HeaderRow.vue';
import ButtonToPath from '~/components/views/application/buttons/ButtonToPath.vue';

enum Tabs {
  groups,
  subjects,
}

@Component({
  components: {
    ButtonToPath,
    HeaderRow,
    RecordId,
    ButtonToModal,
    ArchiveRecordModal,
    PrintCourseTerms,
    BRecordLink,
    Show2Page,
    ShowPageAction,
    ShowPageTableRow,
    SubjectsListing,
    CourseGroups,
    ShowRecordLink,
  },
})
export default class extends DatabasePage {
  Tabs = Tabs;
  currentTab: Tabs = Tabs.groups;

  course: null | course.Course = null;

  get labels (): RecordHeaderLabels {
    const labels = new RecordHeaderLabels();
    if (this.course?.archived_at) labels.add({ name: 'archived' });
    return labels;
  }

  onLoad (course) {
    this.course = course;
  }
}
</script>

<template>
  <show2-page
    entity="courses"
    @load="onLoad"
  >
    <template #title />

    <template #actions="{ record }">
      <ul class="list-group">
        <li
          v-if="$admission.can('courses.update')"
          class="list-group-item d-flex p-1 border-0"
        >
          <ButtonToPath
            class="btn-outline-secondary border-0 flex-fill"
            :path="`/database/courses/${record.id}/edit`"
          >
            <b-icon icon="pencil" class="mr-3" />
            <t value="lexicon.to_edit" />
          </ButtonToPath>
        </li>
        <li
          v-if="
            $ema.canI('act:/courses/actions/archive') &&
              !record.archived_at
          "
          class="list-group-item d-flex p-1 border-0"
        >
          <ButtonToModal
            v-slot="{ shown }"
            class="btn-outline-secondary border-0 flex-fill"
          >
            <b-icon icon="lock" class="mr-3" />
            <t value="lexicon.to_archive" />
            <ArchiveRecordModal
              v-model="shown.ref"
              entity="courses"
              :record-id="record.id"
              @archived="$router.push('/database/courses')"
            />
          </ButtonToModal>
        </li>
      </ul>
    </template>

    <template #details="{ record }">
      <table class="table">
        <HeaderRow
          :record="record"
          :path="`/database/courses/${record.id}`"
          :name="record.name?.[1]"
          :labels="labels"
        />
        <show-page-table-row label="db.record.schools.meta.s">
          <b-record-link entity="schools" :record="record.school" />
        </show-page-table-row>
        <show-page-table-row label="db.record.courses.label.education_level">
          <b-record-link entity="education_levels" :record="record.education_level" />
        </show-page-table-row>
        <show-page-table-row label="db.record.courses.label.grade">
          {{ record.grade }}
        </show-page-table-row>
        <show-page-table-row label="db.record.courses.label.school_year">
          <b-record-link
            v-if="record.school_year"
            entity="school_years"
            :record="record.school_year"
          />
        </show-page-table-row>
        <show-page-table-row label="db.record.courses.label.term_dates">
          <PrintCourseTerms :dates="record.term_dates" />
        </show-page-table-row>
      </table>
    </template>

    <template #container="{ record }">
      <b-tabs v-model="currentTab" content-class="emt-3 emb-6" no-fade>
        <b-tab>
          <template #title>
            <t value="db.record.groups.meta.p" />
          </template>
          <div v-if="currentTab === Tabs.groups">
            <course-groups :course="record" />
          </div>
        </b-tab>
        <b-tab>
          <template #title>
            <t value="db.record.subjects.meta.p" />
          </template>
          <div v-if="currentTab === Tabs.subjects">
            <subjects-listing :course="record" />
          </div>
        </b-tab>
      </b-tabs>
    </template>
  </show2-page>
</template>
