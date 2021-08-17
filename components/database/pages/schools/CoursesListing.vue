<template>
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
          variant="outline-danger"
          class="btn-xs"
          title="remove"
          @click="onRemove(dataItem)"
        >
          <b-icon icon="dash" />
        </b-button>
      </template>
      <template #footer>
        <tr>
          <td>
            <b-button
              variant="outline-primary"
              class="btn-xs"
              title="add"
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
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Course, School } from '~/lib/records';
import { AssociatedRecord } from '~/lib/api/mappers';

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
        { name: 'course', getText: course => course.caption, size: 300 },
        { name: 'education_level', getText: course => course.labels.education_level, size: 300 },
      ],
      changes: {
        removeIds: [],
        addFormShown: false,
        addFormValues: {},
        addFormFields: [
          { name: 'course', control: { type: 'assoc', entity: 'courses' } },
        ],
        addedCourses: [],
      },
      saveChangesQueryState: this.$api.newQueryState(),
    };
  },
  computed: {
    fetchedRecords (): Course[] {
      const fetchResult = this.fetchQueryState.value as { records: Array<AssociatedRecord<Course>> };
      if (!fetchResult) {
        return [];
      }

      return fetchResult.records;
    },
    records (): Course[] {
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
    onRemove (course: Course) {
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
    onAddFormChange ({ course }) {
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

      this.fetchQueryState.value = null;
      this.fetch();
    },
  },
});
</script>
