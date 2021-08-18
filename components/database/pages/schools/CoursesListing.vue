<template>
  <div>
    <div class="emb-2 d-flex align-items-center">
      <strong>Courses Offered</strong>
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
          {{ $t(`record.schools.${column.name}`) }}
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
import { School } from '~/lib/records';

export default Vue.extend({
  props: {
    school: { type: Object as PropType<School>, required: true },
  },
  data () {
    return {
      fetchQueryState: this.$api.newQueryState(),
      tableColumns: [
        { name: 'actions', slot: 'actions', headerText: false, size: 40 },
        { name: 'id', cell: { type: 'link', entity: 'courses' }, size: 60 },
        { name: 'course', getText: (course: any) => course.caption, size: 300 },
        { name: 'education_level', getText: (course: any) => course.labels.education_level, size: 300 },
      ],
      editable: false,
      changes: {
        removeIds: [] as number[],
        addFormShown: false,
        addFormValues: {},
        addFormFields: [
          { name: 'course', control: { type: 'assoc', entity: 'courses' } },
        ],
        addedCourses: [] as any[],
      },
      saveChangesQueryState: this.$api.newQueryState(),
    };
  },
  computed: {
    fetchedRecords (): any[] {
      const fetchResult = this.fetchQueryState.value as { records: any[] };
      if (!fetchResult) {
        return [];
      }

      return fetchResult.records;
    },
    records (): any[] {
      const { removeIds, addedCourses } = this.changes;
      return addedCourses.concat(this.fetchedRecords).filter(record => !removeIds.includes(record.id));
    },
    changed (): boolean {
      const { removeIds, addedCourses } = this.changes;
      return removeIds.length > 0 || addedCourses.length > 0;
    },
  },
  mounted () {
    this.fetch();
  },
  methods: {
    fetch () {
      this.$api.request(
        this.$api.queries.schools.searchCourses(this.school.id),
        this.fetchQueryState,
      );
    },
    onToggleEditable () {
      if (this.editable) {
        this.changes.addFormShown = false;
        this.changes.removeIds = [];
        this.changes.addedCourses = [];
      }
      this.editable = !this.editable;
    },
    onRemove (course: any) {
      if (this.saveChangesQueryState.running) return;

      const { removeIds, addedCourses } = this.changes;
      const inAdded = addedCourses.findIndex(addedCourse => addedCourse.id === course.id);
      if (inAdded === -1) {
        removeIds.push(course.id);
      } else {
        addedCourses.splice(inAdded, 1);
      }
    },
    onShowAddForm () {
      if (this.saveChangesQueryState.running) return;

      this.changes.addFormShown = true;
    },
    onAddFormChange ({ course }: any) {
      if (this.saveChangesQueryState.running) return;

      this.changes.addFormShown = false;
      if (!this.records.find(addedCourse => addedCourse.id === course.id)) {
        this.changes.addedCourses.push(course);
      }
    },
    async saveChanges () {
      const newIds = this.records.map(course => course.id);
      this.changes.addFormShown = false;

      await this.$api.request(
        this.$api.queries.schools.update(this.school.id, {
          new_courses_ids: newIds,
        }),
        this.saveChangesQueryState,
      );

      this.changes.removeIds = [];
      this.changes.addedCourses = [];
      this.editable = false;

      this.fetchQueryState.value = null;
      this.fetch();
    },
  },
});
</script>
