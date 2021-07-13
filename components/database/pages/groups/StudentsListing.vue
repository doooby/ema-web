<template>
  <div>
    <data-table-view
      :columns="columns"
      :dataset="students"
    >
      <template #header-cell="{ column }">
        {{ $t(`record.students.${column.name}`) }}
      </template>
    </data-table-view>
    <div v-if="editable">
      add new
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Group, Student } from '~/lib/records';
import { defineTableColumns, View as DataTableView } from '~/components/DataTable';

export default Vue.extend({
  components: { DataTableView },
  props: {
    group: { type: Object as PropType<Group>, required: true },
    editable: { type: Boolean, default: false },
  },
  data () {
    return {
      columns: defineTableColumns([
        { name: 'id' },
        { name: 'full_name', cell: { type: 'link', entity: 'students' } },
      ]),
      students: [] as Student[],
      fetching: this.$api.createRequestState(),
    };
  },
  mounted () {
    this.fetchStudents();
  },
  methods: {
    async fetchStudents () {
      if (this.fetching.running) return;
      const result = await this.$api.query(
        this.fetching,
        this.$api.queries.students.search,
        { group_id: this.group.id },
      );
      if (result !== null) {
        this.students = [ ...result.records ];
        this.$emit('loaded', this.students);
      } else {
        this.$emit('load-fail');
      }
    },
  },
});
</script>
