<template>
  <div>
    <b-alert :show="getCoursesQueryState.running" variant="info" class="m-2">
      <t value="app.loading" />
    </b-alert>
    <div v-if="getCoursesQueryState.value" class="row">
      <data-table-view
        class="col"
        :columns="tableColumns"
        :dataset="getCoursesQueryState.value.records"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Course, School } from '~/lib/records';
import { PaginatedRecords } from '~/lib/api/mappers';
import RecordLink from '~/components/database/cells/RecordLink.vue';
import Name from '~/components/database/cells/Name.vue';
import AssociatedRecordLink from '~/components/database/cells/AssociatedRecordLink.vue';

@Component
export default class CoursesListing extends Vue {
  @Prop({ required: true }) readonly school!: School;

  getCoursesQueryState = this.$api.newQueryState<PaginatedRecords<Course>>();
  tableColumns = [
    { name: 'id', cell: { type: RecordLink, entity: 'courses' }, size: 60 },
    { name: 'name', cell: { type: Name }, headerText: () => 'Name' },
    {
      name: 'education_level',
      cell: { type: AssociatedRecordLink, entity: 'education_levels', noLink: true },
      headerText: () => 'Education Level',
    },
    { name: 'grade', headerText: () => 'Grade' },
  ];

  @Watch('school')
  onPageChanged () {
    this.reloadCourses();
  }

  mounted () {
    this.reloadCourses();
  }

  get currentCountryId (): null | number {
    return this.$store.state.session.currentCountry?.id ?? null;
  }

  reloadCourses () {
    this.getCoursesQueryState.reset();
    this.fetchCourses();
  }

  async fetchCourses () {
    const query = this.$api.queries.courses.index;
    await this.$api.request(query({
      school_id: this.school.id,
      country_id: this.currentCountryId,
      per_page: 50,
    }), this.getCoursesQueryState);
  }
}
</script>
