<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ARecordLink from '~/components/database/components/ARecordLink.vue';
import TextNames from '~/components/database/components/TextNames.vue';
import ARecordsListing from '~/components/database/components/listing/ARecordsListing.vue';
import { Params } from '~/lib/api2';
import { application_record } from '~/lib/records';
import { Column } from '~/components/DataTable/v3';
import education_levels from '~/pages/database/education_levels/index.vue';
import BRecordLink from '~/components/database/components/BRecordLink.vue';

@Component({
  computed: {
    education_levels () {
      return education_levels;
    },
  },
  components: { BRecordLink, ARecordsListing, ARecordLink, TextNames },
})
export default class extends Vue {
  @Prop({ default: () => [] }) readonly initialColumns!: Column[];
  @Prop({ default: () => {} }) readonly params!: Params;

  columns = [
    { name: 'id', size: 80 },
    ...application_record.fillDataTableColumns('subjects', [
      { name: 'name' },
      { name: 'education_levels', size: 400 },
    ]),
  ];
}
</script>

<template>
  <a-records-listing
    :class="$attrs.class"
    entity="subjects"
    :initial-columns="initialColumns"
    :columns="columns"
    :params="params"
    @change="$emit('change', $event)"
  >
    <template #row="{ record }">
      <td>
        <a-record-link :id="record.id" entity="subjects" />
      </td>
      <td>
        <text-names class-name="single-row-cell" :value="record.name" />
      </td>
      <td>
        <div v-for="education_level of education_levels">
          <b-record-link entity="education_levels" :record="education_level" />
        </div>
      </td>
      <td />
    </template>
  </a-records-listing>
</template>
