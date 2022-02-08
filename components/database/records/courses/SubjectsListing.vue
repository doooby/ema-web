<template>
  <div>
    <b-alert :show="getSubjectsQueryState.running" variant="info" class="m-2">
      <t value="app.loading" />
    </b-alert>
    <div v-if="getSubjectsQueryState.value" class="row">
      <data-table-view
        class="col"
        :columns="tableColumns"
        :dataset="getSubjectsQueryState.value.records"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { Course, Subject } from '~/lib/records';
import { PaginatedRecords } from '~/lib/api/mappers';
import RecordLink from '~/components/database/cells/RecordLink.vue';

@Component
export default class SubjectsListing extends Vue {
  @Prop({ required: true }) readonly course!: Course;

  getSubjectsQueryState = this.$api.newQueryState<PaginatedRecords<Subject>>();
  tableColumns = [
    { name: 'id', cell: { type: RecordLink, onlyId: true }, size: 60 },
    { name: 'name_en' },
    { name: 'name' },
  ];

  @Watch('course')
  onPageChanged () {
    this.reloadSubjects();
  }

  mounted () {
    this.reloadSubjects();
  }

  get currentCountryId (): null | number {
    return this.$store.state.session.currentCountry?.id ?? null;
  }

  reloadSubjects () {
    this.getSubjectsQueryState.reset();
    this.fetchSubjects();
  }

  async fetchSubjects () {
    const query = this.$api.queries.subjects.index;
    await this.$api.request(query({
      course_id: this.course.id,
      country_id: this.currentCountryId,
      per_page: 50,
    }), this.getSubjectsQueryState);
  }
}
</script>
