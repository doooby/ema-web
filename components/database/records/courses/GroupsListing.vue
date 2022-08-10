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
import { Course, Group } from '~/lib/records';
import { PaginatedRecords } from '~/lib/api/mappers';
import RecordLink from '~/components/database/cells/RecordLink.vue';

@Component
export default class GroupsListing extends Vue {
  @Prop({ required: true }) readonly course!: Course;

  getGroupsQueryState = this.$api.newQueryState<PaginatedRecords<Group>>();
  tableColumns = [
    { name: 'id', cell: { type: RecordLink, entity: 'groups' }, size: 60 },
    { name: 'name_en', headerText: () => 'Name' },
    { name: 'term', headerText: () => 'term' },
  ];

  @Watch('course')
  onPageChanged () {
    this.reloadGroups();
  }

  mounted () {
    this.reloadGroups();
  }

  get currentCountryId (): null | number {
    return this.$store.state.session.currentCountry?.id ?? null;
  }

  reloadGroups () {
    this.getGroupsQueryState.reset();
    this.fetchGroups();
  }

  async fetchGroups () {
    const query = this.$api.queries.groups.index;
    await this.$api.request(query({
      course_id: this.course.id,
      country_id: this.currentCountryId,
      per_page: 50,
    }), this.getGroupsQueryState);
  }
}
</script>
