<template>
  <div>
    <data-table-view
      :columns="columns"
      :actions-column-width="50"
      :dataset="students"
    >
      <template #header-cell="{ column }">
        {{ $t(`record.students.${column.name}`) }}
      </template>
      <template v-if="editable" #row-actions-cell="{ item }">
        <b-button variant="outline-danger" @click="removeStudent(item)">
          <b-icon-dash />
        </b-button>
      </template>
    </data-table-view>
    <div v-if="editable">
      <div>
        <b-button
          v-if="!additionShown"
          variant="outline-primary"
          @click="showAddition"
        >
          <b-icon-plus />
        </b-button>
        <b-card v-if="additionShown">
          <form-view
            :value="additionValues"
            :fields="additionFields"
          />
        </b-card>
      </div>
      <div class="text-right">
        <span v-if="updating.running">
          {{ $t('db.shared.processing') }}
        </span>
        <b-button
          variant="success"
          :disabled="updating.running || !changed"
          @click="save"
        >
          {{ $t('db.shared.save') }}
        </b-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Group, Student } from '~/lib/records';
import { createFormModel, defineFormFields, formModelToRecordParams, View as FormView } from '~/components/Form';
import { defineTableColumns, View as DataTableView } from '~/components/DataTable';
import { BIconDash, BIconPlus } from 'bootstrap-vue';

export default Vue.extend({
  components: { DataTableView, FormView, BIconDash, BIconPlus },
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
      changed: false,
      additionShown: true,
      additionValues: createFormModel(),
      additionFields: defineFormFields([
        { name: 'student', control: { type: 'assoc', entity: 'students' } },
      ]),
      updating: this.$api.createRequestState(),
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
    removeStudent (student: Student) {
      const index = this.students.indexOf(student);
      if (index !== -1) this.students.splice(index, 1);
      this.changed = true;
    },
    showAddition () {
      this.additionShown = true;
    },
    save () {
      const params = formModelToRecordParams(this.additionFields, this.additionValues);
      console.log({ params });
    },
  },
});
</script>
