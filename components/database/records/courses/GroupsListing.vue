<template>
  <div>
    <b-alert :show="getGroupsQueryState.running" variant="info" class="m-2">
      <t value="app.loading" />
    </b-alert>
    <div v-if="getGroupsQueryState.value" class="row">
      <data-table-view
        class="col"
        :columns="tableColumns"
        :dataset="getGroupsQueryState.value.records"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Course } from '~/lib/records';
import RecordLink from '~/components/database/cells/RecordLink.vue';
import Name from '~/components/database/cells/Name.vue';
import { SearchRecordsResponsePayload } from '~/lib/api2';
import { RequestState } from '~/lib/api';

@Component
export default class GroupsListing extends Vue {
  @Prop({ required: true }) readonly course!: Course;

  getGroupsQueryState2 = this.$api2.newQueryState<SearchRecordsResponsePayload>();
  tableColumns = [
    { name: 'id', cell: { type: RecordLink, entity: 'groups' }, size: 60 },
    { name: 'name', cell: { type: Name }, headerText: () => 'Name' },
    { name: 'term', headerText: () => 'term' },
  ];

  @Watch('course')
  onPageChanged () {
    this.reloadGroups();
  }

  mounted () {
    this.reloadGroups();
  }

  get getGroupsQueryState (): RequestState {
    return this.$api2.mapResponseToV1RequestState(this.getGroupsQueryState2);
  }

  reloadGroups () {
    this.getGroupsQueryState.reset();
    this.fetchGroups();
  }

  fetchGroups () {
    if (this.getGroupsQueryState2.processing) return;

    this.$api2.request(
      this.getGroupsQueryState2,
      this.$api2.getQuery('groups', 'search')({
        course_id: this.course.id,
        country_id: this.$store.getters['session/countryId'],
        per_page: 50,
      }),
    );
  }
}
</script>
