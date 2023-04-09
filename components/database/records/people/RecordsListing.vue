<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ARecordLink from '~/components/database/components/ARecordLink.vue';
import TextNames from '~/components/database/components/TextNames.vue';
import ARecordsListing2 from '~/components/database/components/listing/ARecordsListing2.vue';
import { Params } from '~/lib/api2';
import { Column } from '~/components/DataTable/v3';
import { h } from 'vue';

@Component({
  components: { ARecordsListing2, ARecordLink, TextNames },
})
export default class RecordsListing extends Vue {
  @Prop({ default: () => [] }) readonly initialColumns!: Column[];
  @Prop({ default: () => {} }) readonly params!: Params;

  columns = [
    { name: 'id', size: 80 },
    { name: 'student_kobo_no', size: 180, renderHeader: this.renderHeader },
    { name: 'first_name', size: 180, renderHeader: this.renderHeader },
    { name: 'last_name', size: 180, renderHeader: this.renderHeader },
    { name: 'born_on', size: 180, renderHeader: this.renderHeader },
  ];

  renderHeader (column) {
    return h('t', {
      props: { value: `db.record.people.label.${column.name}` },
      class: 'text-break',
    });
  }
}
</script>

<template>
  <a-records-listing2
    :class="$attrs.class"
    entity="people"
    :initial-columns="initialColumns"
    :columns="columns"
    :params="params"
    @change="$emit('change', $event)"
  >
    <template #row="{ record }">
      <td>
        <div class="text-center">
          <a-record-link :id="record.id" entity="people" />
        </div>
      </td>
      <td>
        {{ record.student_kobo_no }}
      </td>
      <td>
        <text-names class-name="single-row-cell" :value="record.first_name" />
      </td>
      <td>
        <text-names class-name="single-row-cell" :value="record.last_name" />
      </td>
      <td>
        <span v-if="record.born_on">{{ $d(record.born_on) }}</span>
      </td>
      <td />
    </template>
    <template #footer>
      <slot name="footer" />
    </template>
  </a-records-listing2>
</template>
