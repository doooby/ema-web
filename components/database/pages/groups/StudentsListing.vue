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
            :value="{}"
            :fields="additionFields"
            @input="onAddStudent"
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
import { defineFormFields, formModelToRecordParams, View as FormView } from '~/components/Form';
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
      originalStudentsIds: [] as number[],
      changed: false,
      additionShown: false,
      additionFields: defineFormFields([
        { name: 'student', control: { type: 'assoc', entity: 'students' } },
      ]),
      updating: this.$api.createRequestState(),
      fetchingStudentDetail: this.$api.createRequestState(),
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
        this.originalStudentsIds = this.students.map(s => s.id);
        this.$emit('loaded', this.students);
      } else {
        this.$emit('load-fail');
      }
    },
    removeStudent (student: Student) {
      const index = this.students.indexOf(student);
      if (index !== -1) this.students.splice(index, 1);
      this.updateChangeStatus();
    },
    showAddition () {
      this.additionShown = true;
    },
    async onAddStudent ({ student }: { student: Student }) {
      this.additionShown = false;
      if (this.fetchingStudentDetail.running) return;
      const result = await this.$api.query(
        this.fetchingStudentDetail,
        this.$api.queries.students.get,
        student.id,
      );
      if (result !== null) {
        const id = result.record.id;
        if (!this.students.find(student => student.id === id)) {
          this.students.push(result.record);
          this.updateChangeStatus();
        }
      }
    },
    updateChangeStatus () {
      const union = new Set([ ...this.originalStudentsIds, ...this.students.map(s => s.id) ]);
      this.changed = !(this.originalStudentsIds.length === union.size && this.students.length === union.size);
    },
    save () {
      const params = formModelToRecordParams(this.additionFields, this.additionValues);
      console.log({ params });
    },
  },
});
</script>
