<template>
  <b-modal
    :visible="value"
    hide-header
    @hidden="onHidden"
    @ok="onSubmit"
  >
    <div v-if="value">
      <div class="alert alert-danger" role="alert">
        <t value="db.modals.ConfirmArchiveModal.confirm" />
      </div>
    </div>
  </b-modal>
</template>

<script lang="ts">
import Vue from 'vue';
import { UpdatedRecordResponsePayload } from '~/lib/api2';

export default Vue.extend({
  props: {
    value: { type: Boolean, required: true },
    entity: { type: String, required: true },
    recordId: { type: String, required: true },
  },
  data () {
    return {
      request: this.$api2.newQueryState<UpdatedRecordResponsePayload>(),
    };
  },
  methods: {
    onHidden () {
      this.$emit('input', false);
    },
    async onSubmit (event: any) {
      event.preventDefault();
      if (this.request.processing) return;

      await this.$api2.request(
        this.request,
        this.$api2.getQuery(this.entity, 'update')(
          this.recordId,
          { archive: 1 },
        ),
      );

      this.onHidden();
      this.$emit('recordChanged');
    },
  },
});
</script>
