<template>
  <data-table-view
    :class="$attrs.class"
    class="col"
    :columns="listingColumns"
    :dataset="records"
  >
    <template #header-cell="{ column }">
      <slot name="header-cell" :column="column" />
    </template>
    <template #actions="{ dataItem }">
      <btn-mini
        v-if="editable"
        variant="danger"
        icon="dash"
        @click="onRemove(dataItem)"
      />
    </template>
    <template v-if="editable" #footer>
      <tr>
        <td>
          <btn-mini variant="primary" icon="plus" :disabled="formShown" @click="formShown = !formShown" />
        </td>
        <td :colspan="tableColumns.length + 1">
          <div v-if="formShown" class="ew-14">
            <slot name="edit-form" :on-input-callback="onFormInputCallback" />
          </div>
        </td>
      </tr>
      <tr v-if="changed">
        <td :colspan="tableColumns.length + 2">
          <div class="d-flex justify-content-end">
            <b-button
              variant="success"
              :disabled="commitButtonDisabled"
              @click="onCommitChanges"
            >
              Save Changes
            </b-button>
          </div>
        </td>
      </tr>
    </template>
  </data-table-view>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { DataTable } from '~/components/DataTable';
import ModifiableRecordsList from '~/lib/api/ModifiableRecordsList';

export default Vue.extend({
  props: {
    originalRecords: { type: Array as PropType<any[]>, required: true },
    tableColumns: { type: Array as PropType<DataTable.Column[]>, required: true },
    editable: { type: Boolean, required: true },
  },
  data () {
    return {
      recordsList: new ModifiableRecordsList<any>(this.originalRecords),
      formShown: true,
      commitButtonDisabled: false,
    };
  },
  computed: {
    listingColumns (): DataTable.Column[] {
      return [
        { name: 'actions', slot: 'actions', headerText: false, size: 40 },
        ...this.tableColumns,
      ];
    },
    records (): any[] {
      return this.recordsList.getRecords();
    },
    changed (): boolean {
      return this.recordsList.changed();
    },
  },
  watch: {
    editable (newEditable) {
      if (!newEditable) this.recordsList.reset();
    },
    originalRecords (newRecords) {
      this.recordsList = new ModifiableRecordsList<any>(newRecords);
      this.commitButtonDisabled = false;
    },
  },
  methods: {
    onFormInputCallback (recordToAdd: any, opts?: { hideForm?: boolean }) {
      this.recordsList.add(recordToAdd);
      // if (opts?.hideForm) this.formShown = false;
    },
    onRemove (record: any) {
      this.recordsList.remove(record);
    },
    onCommitChanges () {
      this.commitButtonDisabled = true;
      this.$emit('commitChanges', this.records);
    },
  },
});
</script>
