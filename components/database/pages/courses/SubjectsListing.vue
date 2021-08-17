<template>
  <div>
    <div class="emb-2 d-flex align-items-center">
      <strong>Course's Subjects</strong>
      <b-button
        :variant="editable ? 'secondary' : 'outline-secondary'"
        class="btn-xs eml-3"
        title="Edit"
        @click="onToggleEditable"
      >
        <b-icon icon="pencil" />
      </b-button>
    </div>

    <div class="row no-gutters">
      <data-table-view
        class="col"
        :columns="tableColumns"
        :dataset="records"
      >
        <template #header-cell="{ column }">
          {{ $t(`record.courses.${column.name}`) }}
        </template>
        <template #actions="{ dataItem }">
          <b-button
            v-if="editable"
            variant="outline-danger"
            class="btn-xs"
            title="Remove"
            @click="onRemove(dataItem)"
          >
            <b-icon icon="dash" />
          </b-button>
        </template>
        <template v-if="editable" #footer>
          <tr>
            <td>
              <b-button
                variant="outline-primary"
                class="btn-xs"
                title="Add"
                :disabled="changes.addFormShown"
                @click="onShowAddForm"
              >
                <b-icon icon="plus" />
              </b-button>
            </td>
            <td :colspan="tableColumns.length">
              <div v-if="changes.addFormShown" class="ew-14">
                <form-view
                  :value="changes.addFormValues"
                  :fields="changes.addFormFields"
                  @input="onAddFormChange"
                />
              </div>
            </td>
          </tr>
          <tr v-if="changed">
            <td :colspan="tableColumns.length + 1">
              <div class="d-flex justify-content-end">
                <b-button
                  variant="success"
                  @click="saveChanges"
                >
                  Save Changes
                </b-button>
              </div>
            </td>
          </tr>
        </template>
      </data-table-view>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Subject } from '~/lib/records';
import { AssociatedRecord } from '~/lib/api/mappers';

export default Vue.extend({
  props: {
    course: { type: Object as PropType<Subject>, required: true },
  },
  data () {
    return {
      fetchQueryState: this.$api.newQueryState(),
      tableColumns: [
        { name: 'actions', slot: 'actions', headerText: false, size: 40 },
        { name: 'id', cell: { type: 'link', entity: 'courses' }, size: 60 },
        { name: 'subject', getText: subject => subject.caption, size: 300 },
        { name: 'education_level', getText: subject => subject.labels.education_level, size: 300 },
      ],
      editable: false,
      changes: {
        removeIds: [],
        addFormShown: false,
        addFormValues: {},
        addFormFields: [
          { name: 'subject', control: { type: 'assoc', entity: 'subjects' } },
        ],
        addedSubjects: [],
      },
      saveChangesQueryState: this.$api.newQueryState(),
    };
  },
  computed: {
    fetchedRecords (): Subject[] {
      const fetchResult = this.fetchQueryState.value as { records: Array<AssociatedRecord<Subject>> };
      if (!fetchResult) {
        return [];
      }

      return fetchResult.records;
    },
    records (): Subject[] {
      const { removeIds, addedSubjects } = this.changes;
      return addedSubjects.concat(this.fetchedRecords).filter(record => !removeIds.includes(record.id));
    },
    changed (): boolean {
      const { removeIds, addedSubjects } = this.changes;
      return removeIds.length > 0 || addedSubjects.length > 0;
    },
  },
  mounted () {
    this.fetch();
  },
  methods: {
    fetch () {
      this.$api.request(
        this.$api.queries.courses.searchSubjects(this.course.id),
        this.fetchQueryState,
      );
    },
    onToggleEditable () {
      if (this.editable) {
        this.changes.addFormShown = false;
        this.changes.removeIds = [];
        this.changes.addedSubjects = [];
      }
      this.editable = !this.editable;
    },
    onRemove (subject: Subject) {
      if (this.saveChangesQueryState.running) return;

      const { removeIds, addedSubjects } = this.changes;
      const inAdded = addedSubjects.findIndex(addedSubject => addedSubject.id === subject.id);
      if (inAdded === -1) {
        removeIds.push(subject.id);
      } else {
        addedSubjects.splice(inAdded, 1);
      }
    },
    onShowAddForm () {
      if (this.saveChangesQueryState.running) return;

      this.changes.addFormShown = true;
    },
    onAddFormChange ({ subject }) {
      if (this.saveChangesQueryState.running) return;

      this.changes.addFormShown = false;
      if (!this.records.find(addedSubject => addedSubject.id === subject.id)) {
        this.changes.addedSubjects.push(subject);
      }
    },
    async saveChanges () {
      const newIds = this.records.map(subject => subject.id);
      this.changes.addFormShown = false;

      await this.$api.request(
        this.$api.queries.courses.update(this.course.id, {
          new_subjects_ids: newIds,
        }),
        this.saveChangesQueryState,
      );

      this.changes.removeIds = [];
      this.changes.addedSubjects = [];
      this.editable = false;

      this.fetchQueryState.value = null;
      this.fetch();
    },
  },
});
</script>
