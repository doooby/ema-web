<template>
  <div>
    <div class="emb-2 d-flex align-items-center">
      <strong class="flex-fill">Course's Subjects</strong>
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
            @input="onInputCallback($event.subject, { hideForm: true })"
          />
        </template>
      </editable-records-listing>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Course } from '~/lib/records';
import EditableRecordsListing from '~/components/database/EditableRecordsListing.vue';

export default Vue.extend({
  components: { EditableRecordsListing },
  props: {
    course: { type: Object as PropType<Course>, required: true },
  },
  data () {
    return {
      fetchQueryState: this.$api.newQueryState(),
      tableColumns: [
        { name: 'id', cell: { type: 'link', entity: 'subjects', onlyId: true }, size: 60 },
        { name: 'subject', getText: (subject: any) => subject.caption, size: 300 },
        { name: 'education_level', getText: (subject: any) => subject.labels.education_level, size: 300 },
      ],
      editable: false,
      addFormFields: [
        { name: 'subject', control: { type: 'assoc', entity: 'subjects' } },
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
        this.$api.queries.courses.searchSubjects(this.course.id),
        this.fetchQueryState,
      );
    },
    async onCommitChanges (newRecords: any[]) {
      const newIds = newRecords.map(subject => subject.id);

      await this.$api.request(
        this.$api.queries.courses.update(this.course.id, {
          new_subjects_ids: newIds,
        }),
        this.saveChangesQueryState,
      );

      this.editable = false;
      this.fetch();
    },
  },
});
</script>
