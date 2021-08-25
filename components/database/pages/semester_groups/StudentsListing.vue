<template>
  <div>
    <div class="emb-2 d-flex align-items-center">
      <strong class="flex-fill">Students Attending</strong>
      <b-button
        :variant="editable ? 'secondary' : 'outline-secondary'"
        class="btn-xs eml-3"
        title="Edit"
        @click="editable = !editable"
      >
        <div class="d-flex align-items-center">
          <b-icon icon="pencil" />
          <span v-if="editable" class="eml-3 line-1">
            cancel
          </span>
        </div>
      </b-button>
    </div>

    <div class="row no-gutters">
      <editable-records-listing
        class="col"
        :original-records="originalRecords"
        :table-columns="tableColumns"
        :editable="editable"
        @commitChanges="onCommitChanges"
      >
        <template #header-cell="{ column }">
          {{ $t(`record.students.${column.name}`) }}
        </template>
        <template #edit-form="{ onInputCallback }">
          <form-view
            :fields="addFormFields"
            @input="onInputCallback($event.student, { hideForm: true })"
          />
        </template>
      </editable-records-listing>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { School } from '~/lib/records';
import EditableRecordsListing from '~/components/database/EditableRecordsListing.vue';

export default Vue.extend({
  components: { EditableRecordsListing },
  props: {
    school: { type: Object as PropType<School>, required: true },
  },
  data () {
    return {
      fetchQueryState: this.$api.newQueryState(),
      tableColumns: [
        { name: 'id', cell: { type: 'link', entity: 'students' }, size: 60 },
        { name: 'student', getText: (student: any) => student.caption, size: 300 },
      ],
      editable: false,
      addFormFields: [
        [ 'student', 'associatedRecord', { entity: 'students' } ],
      ],
      saveChangesQueryState: this.$api.newQueryState(),
    };
  },
  computed: {
    originalRecords (): any[] {
      return this.fetchQueryState.value?.records || [];
    },
  },
  mounted () {
    this.fetch();
  },
  methods: {
    fetch () {
      this.$api.request(
        this.$api.queries.semester_groups.searchStudents(this.school.id),
        this.fetchQueryState,
      );
    },
    async onCommitChanges (newRecords: any[]) {
      const newIds = newRecords.map(subject => subject.id);

      await this.$api.request(
        this.$api.queries.semester_groups.update(this.school.id, {
          new_students_ids: newIds,
        }),
        this.saveChangesQueryState,
      );

      this.editable = false;
      this.fetch();
    },
  },
});
</script>
