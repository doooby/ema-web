<template>
  <div>
    <data-table-view
      :columns="columns"
      :dataset="students"
    >
      <template #header-cell="{ column }">
        {{ $t(`record.students.${column.name}`) }}
      </template>
      <template v-if="editable" #actions="{ dataItem }">
        <b-button
          variant="outline-danger"
          size="sm"
          @click="removeStudent(dataItem)"
        >
          <b-icon-dash />
        </b-button>
      </template>
    </data-table-view>
    <div v-if="editable">
      <div>
        <b-button
          v-if="!additionShown"
          variant="outline-primary"
          size="sm"
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
import { Group } from '~/lib/records';
import { AssociatedRecord } from '~/lib/api/mappers';
import { defineFormFields, View as FormView } from '~/components/Form';
import { DataTableView } from '~/components/DataTable';
import { BIconDash, BIconPlus } from 'bootstrap-vue';

export default Vue.extend({
  components: { DataTableView, FormView, BIconDash, BIconPlus },
  props: {
    group: { type: Object as PropType<Group>, required: true },
    editable: { type: Boolean, default: false },
  },
  data () {
    const actionsColumn = this.editable
      ? [ { name: 'actions', slot: 'actions', headerText: false, size: 40 } ]
      : [];
    return {
      columns: [
        ...actionsColumn,
        { name: 'id', cell: { type: 'link', entity: 'students' }, size: 60 },
        { name: 'name', getText: (student: AssociatedRecord) => student.label },
      ],
      students: [] as AssociatedRecord[],
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
        this.$api.queries.students.searchAssociated,
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
    removeStudent (student: AssociatedRecord) {
      const index = this.students.indexOf(student);
      if (index !== -1) this.students.splice(index, 1);
      this.updateChangeStatus();
    },
    showAddition () {
      this.additionShown = true;
    },
    async onAddStudent ({ student }: { student: AssociatedRecord }) {
      this.additionShown = false;
      if (this.fetchingStudentDetail.running) return;
      const result = await this.$api.query(
        this.fetchingStudentDetail,
        this.$api.queries.students.searchAssociated,
        { id: student.id },
      );
      const record = result?.records?.[0];
      if (record) {
        if (!this.students.find(student => student.id === record.id)) {
          this.students.push(record);
          this.updateChangeStatus();
        }
      }
    },
    updateChangeStatus () {
      const union = new Set([ ...this.originalStudentsIds, ...this.students.map(s => s.id) ]);
      this.changed = !(this.originalStudentsIds.length === union.size && this.students.length === union.size);
    },
    async save () {
      if (this.updating.running) return;
      const result = await this.$api.query(
        this.updating,
        this.$api.queries.groups.updateStudents,
        this.group.id,
        this.students.map(s => s.id),
      );
      if (result?.success) {
        this.$router.push({ path: `/database/groups/${this.group.id}` });
      }
    },
  },
});
</script>
