<template>
  <records-browsing
    class="emt-5"
    entity="courses"
    :build-query="onBuildQuery"
    :search-token="searchToken"
    :columns="columns"
    :actions="actions"
  >
    <template #time_ranges="{ dataItem }">
      <div v-if="dataItem.time_ranges">
        {{ fnsFormat(dataItem.time_ranges[0], 'yyyy-MM-dd') }}
        -
        {{ fnsFormat(dataItem.time_ranges[1], 'yyyy-MM-dd') }}
      </div>
    </template>
  </records-browsing>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { School } from '~/lib/records';
import RecordLink from '~/components/database/cells/RecordLink.vue';
import Name from '~/components/database/cells/Name.vue';
import AssociatedRecordLink from '~/components/database/cells/AssociatedRecordLink.vue';
import { format as fnsFormat } from 'date-fns';
import RecordsBrowsing from '~/components/database/RecordsBrowsing/RecordsBrowsing.vue';

@Component({
  components: { RecordsBrowsing },
})
export default class CoursesListing extends Vue {
  @Prop({ required: true }) readonly school!: School;

  fnsFormat = fnsFormat;

  searchToken = Date.now();

  columns = [
    { name: 'id', cell: { type: RecordLink, entity: 'courses' }, size: 60 },
    { name: 'name', cell: { type: Name }, headerText: () => 'Name' },
    {
      name: 'education_level',
      cell: { type: AssociatedRecordLink, entity: 'education_levels', noLink: true },
      headerText: () => 'Education Level',
    },
    { name: 'grade', headerText: () => 'Grade' },
    { name: 'time_ranges', headerText: () => 'Duration', slot: 'time_ranges' },
  ];

  actions = [
    {
      variant: 'outline-primary',
      text: 'app.common.label.add',
      icon: 'plus',
      onClick: () => {
        this.$router.push({
          name: 'database-courses-new',
          params: {
            school_id: this.school.id.toString(),
          },
        });
      },
    },
  ];

  @Watch('school')
  onPageChanged () {
    this.searchToken = Date.now();
  }

  onBuildQuery () {
    return this.$api.queries.courses.index({
      school_id: this.school.id,
      country_id: this.$store.getters['session/countryId'],
    });
  }
}
</script>
