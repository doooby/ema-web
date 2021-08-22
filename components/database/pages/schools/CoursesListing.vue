<template>
  <div>
    <div class="emb-2 d-flex align-items-center">
      <strong class="flex-fill">Courses Offered</strong>
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
          {{ $t(`record.courses.${column.name}`) }}
        </template>
        <template #edit-form="{ onInputCallback }">
          <form-view
            :fields="addFormFields"
            @input="onInputCallback($event.course, { hideForm: true })"
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
        { name: 'id', cell: { type: 'link', entity: 'courses' }, size: 60 },
        { name: 'course', getText: (course: any) => course.caption, size: 300 },
        { name: 'education_level', getText: (course: any) => course.labels.education_level, size: 300 },
      ],
      editable: false,
      addFormFields: [
        [ 'course', 'assoc', { entity: 'courses' } ],
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
        this.$api.queries.schools.searchCourses(this.school.id),
        this.fetchQueryState,
      );
    },
    async onCommitChanges (newRecords: any[]) {
      const newIds = newRecords.map(subject => subject.id);

      await this.$api.request(
        this.$api.queries.schools.update(this.school.id, {
          new_courses_ids: newIds,
        }),
        this.saveChangesQueryState,
      );

      this.editable = false;
      this.fetch();
    },
  },
});
</script>
