<template>
  <div>
    <b-alert :show="getStudentsQueryState.running" variant="info" class="m-2">
      <t value="app.loading" />
    </b-alert>
    <div v-if="getStudentsQueryState.value" class="row">
      <data-table-view
        class="col"
        :columns="tableColumns"
        :dataset="getStudentsQueryState.value.records"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { Group, Person } from '~/lib/records';
import { PaginatedRecords } from '~/lib/api/mappers';
import RecordLink from '~/components/database/cells/RecordLink.vue';

@Component
export default class StudentsListing extends Vue {
  @Prop({ required: true }) readonly group!: Group;

  getStudentsQueryState = this.$api.newQueryState<PaginatedRecords<Person>>();
  tableColumns = [
    { name: 'id', cell: { type: RecordLink, entity: 'people' }, size: 60 },
    { name: 'name_en', getText: ({ family_name_en, given_name_en }: any) => `${family_name_en}, ${given_name_en}` },
    { name: 'name', getText: ({ family_name, given_name }: any) => `${family_name}, ${given_name}` },
  ];

  @Watch('group')
  onPageChanged () {
    this.reloadStudents();
  }

  mounted () {
    this.reloadStudents();
  }

  get currentCountryId (): null | number {
    return this.$store.state.session.currentCountry?.id ?? null;
  }

  reloadStudents () {
    this.getStudentsQueryState.reset();
    this.fetchStudents();
  }

  async fetchStudents () {
    const query = this.$api.queries.people.index;
    await this.$api.request(query({
      group_id: this.group.id,
      country_id: this.currentCountryId,
      per_page: 50,
    }), this.getStudentsQueryState);
  }
}
</script>
